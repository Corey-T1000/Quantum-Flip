// Performance monitoring utility
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  private static readonly MAX_SAMPLES = 100;

  static startMeasure(id: string): number {
    return performance.now();
  }

  static endMeasure(id: string, startTime: number) {
    const duration = performance.now() - startTime;
    if (!this.measurements.has(id)) {
      this.measurements.set(id, []);
    }
    
    const measurements = this.measurements.get(id)!;
    measurements.push(duration);
    
    // Keep only the last MAX_SAMPLES measurements
    if (measurements.length > this.MAX_SAMPLES) {
      measurements.shift();
    }
  }

  static getAverageTime(id: string): number | null {
    const measurements = this.measurements.get(id);
    if (!measurements || measurements.length === 0) return null;
    
    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  static getMetrics(id: string) {
    const measurements = this.measurements.get(id);
    if (!measurements || measurements.length === 0) return null;
    
    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      average: this.getAverageTime(id),
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      samples: measurements.length
    };
  }

  static clearMeasurements(id?: string) {
    if (id) {
      this.measurements.delete(id);
    } else {
      this.measurements.clear();
    }
  }

  static async measure<T>(id: string, fn: () => Promise<T>): Promise<T> {
    const start = this.startMeasure(id);
    try {
      return await fn();
    } finally {
      this.endMeasure(id, start);
    }
  }

  static measureSync<T>(id: string, fn: () => T): T {
    const start = this.startMeasure(id);
    try {
      return fn();
    } finally {
      this.endMeasure(id, start);
    }
  }
}

// Performance decorator for class methods
export function measure(id?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const measurementId = id || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      if (originalMethod.constructor.name === 'AsyncFunction') {
        return await PerformanceMonitor.measure(measurementId, () =>
          originalMethod.apply(this, args)
        );
      } else {
        return PerformanceMonitor.measureSync(measurementId, () =>
          originalMethod.apply(this, args)
        );
      }
    };

    return descriptor;
  };
}

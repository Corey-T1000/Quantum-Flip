import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleHighContrast, setVolume } from '../store/settingsSlice';
import SettingsModal from './SettingsModal';
import { ColorPalette } from './terminal/types';

interface ConnectedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPalettes: ColorPalette[];
  textColor: string;
}

const ConnectedSettingsModal: React.FC<ConnectedSettingsModalProps> = ({
  isOpen,
  onClose,
  colorPalettes,
  textColor
}) => {
  const dispatch = useAppDispatch();
  const {
    highContrastMode,
    volume
  } = useAppSelector(state => state.settings);

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      colorPalettes={colorPalettes}
      textColor={textColor}
      highContrastMode={highContrastMode}
      onHighContrastToggle={() => dispatch(toggleHighContrast())}
      volume={volume}
      onVolumeChange={(value) => dispatch(setVolume(value))}
    />
  );
};

export default ConnectedSettingsModal;

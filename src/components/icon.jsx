import { createIconSetFromIcoMoon } from '@expo/vector-icons';
/* eslint-disable*/
import { useFonts } from 'expo-font';
import fontData from '../../assets/fonts/icomoon.ttf';
import fontSelectionJson from '../../assets/fonts/selection.json';
import { number, string } from 'prop-types';

const CutomIcon = createIconSetFromIcoMoon(
  fontSelectionJson,
  'icoMoon',
  'icomoon.ttf',
);

function Icon(props) {
  const { name, color, size } = props;
  const [fontLoaded] = useFonts({
    icoMoon: fontData,
  });
  if (!fontLoaded) {
    return null;
  }
  return (
    <CutomIcon name={name} size={size} color={color} />
  )
}

Icon.propTypes = {
  size: number.isRequired,
  color: string.isRequired,
  name: string.isRequired,
};

export default Icon;

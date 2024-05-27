import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const BinIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    >
      <Path d="M18.89 9.554c0 8.02 1.154 11.644-6.61 11.644-7.765 0-6.587-3.625-6.587-11.644M20.365 6.48H4.215M15.715 6.48s.528-3.766-3.426-3.766c-3.953 0-3.425 3.766-3.425 3.766" />
    </G>
  </Svg>
);
export default BinIcon;

import styled from "styled-components";

interface ImageProps {
	src: string;
	isVisible: boolean;
	width: number;
	height: number;
}

const StyledImage = styled.img`
  user-select: none;
  touch-action: none;
  cursor: inherit;
  -webkit-user-drag: none;
`;

const AnimationImage = ({ src, isVisible, width, height }: ImageProps) => {
	const d = isVisible ? "block" : "none";
	return (
		<StyledImage
			alt="Rotating object"
			src={src}
			width={width}
			height={height}
			style={{ display: `${d}` }}
		/>
	);
};

export default AnimationImage;

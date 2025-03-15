import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import AnimationImage from "../AnimationImage/AnimationImage";
import StyledRotateIcon from "../icons/StyledRotateIcon";
import type { HtmlHTMLAttributes, ReactNode } from "react";

// The regular % can return negative numbers.
function moduloWithoutNegative(value: number, n: number): number {
	return ((value % n) + n) % n;
}

export type ZeroPadRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface React360ViewerProps {
	imageSources: { src: string; index: string }[];
	imageIndexSeparator?: string;
	imageInitialIndex?: number;
	mouseDragSpeed?: number;
	autoplaySpeed?: number;
	reverse?: boolean;
	autoplay?: boolean;
	autoplayTarget?: number;
	width?: number;
	height?: number;
	zeroPad?: ZeroPadRange;
	showRotationIconOnStartup?: boolean;
	customRotationIcon?: () => ReactNode;
	notifyOnPointerDown?: (x: number, y: number) => void;
	notifyOnPointerUp?: (x: number, y: number) => void;
	notifyOnPointerMoved?: (x: number, y: number) => void;
	shouldNotifyEvents?: boolean;
}

/** Base props *and* all available HTML div element props. */
export type React360ViewerPropsExtended = HtmlHTMLAttributes<HTMLDivElement> &
	React360ViewerProps;

interface StyleProps {
	isGrabbing: boolean;
}

const StyledDiv = styled.div<StyleProps>`
  position: relative;
  border: none;
  padding: 5px;
  display: inline-block;
  user-select: none;
  touch-action: none;
  ${(props) =>
		props.isGrabbing
			? css`
          cursor: grabbing;
        `
			: css`
          cursor: pointer;
        `};
`;

export const React360Viewer = ({
	imageSources,
	mouseDragSpeed = 20,
	reverse = false,
	autoplaySpeed = 10,
	autoplay = false,
	autoplayTarget,
	width = 150,
	height = 150,
	showRotationIconOnStartup = false,
	customRotationIcon,
	imageInitialIndex = 0,
	shouldNotifyEvents = false,
	notifyOnPointerDown,
	notifyOnPointerUp,
	notifyOnPointerMoved,
}: React360ViewerPropsExtended) => {
	const elementRef = useRef(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const [initialMousePosition, setInitialMousePosition] = useState(0);
	const [startingImageIndexOnPointerDown, setStartingImageIndexOnPointerDown] =
		useState(0);
	const [currentMousePosition, setCurrentMousePosition] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const [showRotationIcon, setShowRotationIcon] = useState(
		showRotationIconOnStartup,
	);
	const [useAutoplay, setUseAutoplay] = useState(autoplay);

	const incrementImageIndex = useCallback(
		(change: number) => {
			setSelectedImageIndex((currIndex) => {
				const index = moduloWithoutNegative(
					currIndex + (reverse ? -1 : 1) * Math.floor(change),
					imageSources.length,
				);

				if (autoplayTarget !== undefined && index === autoplayTarget) {
					setUseAutoplay(false);
				}

				return index;
			});
		},
		[reverse, imageSources.length, autoplayTarget],
	);

	useEffect(() => {
		setUseAutoplay(autoplay);

		setShowRotationIcon(!autoplay && showRotationIconOnStartup);
	}, [autoplay, showRotationIconOnStartup]);

	useEffect(() => {
		if (typeof imageInitialIndex === "undefined") return;
		if (imageInitialIndex < 0 || imageInitialIndex >= imageSources.length) {
			setSelectedImageIndex(imageInitialIndex);
			console.warn(
				`ImageInitialIndex of ${imageInitialIndex} was out of bounds of 0 and count: ${imageSources.length}`,
			);
		}

		setSelectedImageIndex(imageInitialIndex);
	}, [imageInitialIndex, imageSources.length]);

	useEffect(() => {
		if (!useAutoplay) return;

		const timer = setTimeout(() => {
			incrementImageIndex(1);
		}, 1000 / autoplaySpeed);

		return () => clearTimeout(timer);
	}, [autoplaySpeed, useAutoplay, incrementImageIndex]);

	const onMouseDown = (e: React.MouseEvent) => {
		setInitialMousePosition(e.clientX);
		setCurrentMousePosition(e.clientX);
		setStartingImageIndexOnPointerDown(selectedImageIndex);
		setUseAutoplay(false);
		setIsScrolling(true);
		setShowRotationIcon(false);

		document.addEventListener(
			"mouseup",
			() => {
				onMouseUp();
			},
			{ once: true },
		);

		if (shouldNotifyEvents) notifyOnPointerDown?.(e.clientX, e.clientY);
	};

	const onMouseUp = (e?: React.MouseEvent) => {
		setIsScrolling(false);

		if (!shouldNotifyEvents) return;

		if (typeof e !== "undefined") notifyOnPointerUp?.(e?.clientX, e.clientY);
		else {
			notifyOnPointerUp?.(0, 0);
		}
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isScrolling) return;

		setCurrentMousePosition(e.clientX);

		if (shouldNotifyEvents) notifyOnPointerMoved?.(e.clientX, e.clientY);
	};

	useEffect(() => {
		const imageIndexWithOffset = (start: number, offset: number) => {
			const index = moduloWithoutNegative(
				start + (reverse ? -1 : 1) * Math.floor(offset),
				imageSources.length,
			);
			setSelectedImageIndex(index);
		};

		if (!isScrolling) return;

		// Aim is to get a speedfactor that can be easily adjusted from a user perspective
		// as well as proportionate to the size of the image.
		const scaleFactor = 100;
		const speedFactor =
			(1 / mouseDragSpeed) * ((imageSources.length * width) / scaleFactor);
		const changeInX = currentMousePosition - initialMousePosition;

		const difference = changeInX / speedFactor;

		imageIndexWithOffset(startingImageIndexOnPointerDown, difference);
	}, [
		currentMousePosition,
		imageSources.length,
		startingImageIndexOnPointerDown,
		initialMousePosition,
		isScrolling,
		mouseDragSpeed,
		width,
		reverse,
	]);

	return (
		<StyledDiv
			ref={elementRef}
			isGrabbing={isScrolling}
			onPointerDown={onMouseDown}
			// onPointerUp={onMouseUp}
			onPointerMove={onMouseMove}
			// onMouseDown={onMouseDown}
			// onMouseMove={onMouseMove}
		>
			{showRotationIcon ? (
				<>
					{customRotationIcon ? (
						<>{customRotationIcon()}</>
					) : (
						<StyledRotateIcon widthInEm={2} isReverse={reverse} />
					)}
				</>
			) : null}
			{imageSources.map((s, index) => (
				<AnimationImage
					src={s.src}
					width={width}
					height={height}
					isVisible={index === selectedImageIndex}
					key={`${s.src}-${index}`}
				/>
			))}
		</StyledDiv>
	);
};

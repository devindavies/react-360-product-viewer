import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import {
  React360Viewer,
  React360ViewerProps,
} from "../components/React360Viewer";

export default {
  title: "React360Viewer",
  component: React360Viewer,
} as ComponentMeta<typeof React360Viewer>;

const Template: ComponentStory<typeof React360Viewer> = (
  args: React360ViewerProps
) => {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        boxShadow: "5px 5px 5px grey",
      }}
    >
      <React360Viewer {...args} />{" "}
    </div>
  );
};

export const Standard = Template.bind({});
const baseImageSetting = {
  imagesBaseUrl: "./imageSeries/",
  imagesCount: 36,
  imagesFiletype: "png",
  mouseDragSpeed: 20,
};
Standard.args = {
  ...baseImageSetting,
  reverse: false,
} as React360ViewerProps;

export const AutoPlayReversed = Template.bind({});
AutoPlayReversed.args = {
  ...baseImageSetting,
  reverse: true,
  autoplay: true,
};

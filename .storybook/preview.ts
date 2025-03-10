import type { Preview } from "@storybook/react";

export const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		layout: "centered",
	},
};
export const tags = ["autodocs", "autodocs", "autodocs"];

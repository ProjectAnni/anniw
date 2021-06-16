import { Story, Meta } from "@storybook/react";
import { RecoilRoot } from "recoil";

import { Playlist, PlaylistProps } from "../../components/Playlist";

export default {
  title: "Player/Playlist",
  component: Playlist,
  decorators: [(s) => <RecoilRoot>{s()}</RecoilRoot>],
  argTypes: {},
} as Meta;

const Template: Story<PlaylistProps> = (args) => <Playlist {...args} />;

export const Default = Template.bind({});

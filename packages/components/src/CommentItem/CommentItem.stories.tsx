import type { StoryFn, Meta } from '@storybook/react'
import { CommentItem } from './CommentItem'

export default {
  title: 'Components/CommentItem',
  component: CommentItem,
} as Meta<typeof CommentItem>

export const Default: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    _id={'abc'}
    isEditable={false}
    text="Ut dignissim, odio a cursus pretium, erat ex dictum quam, a eleifend augue mauris vel metus. Suspendisse pellentesque, elit efficitur rutrum maximus, arcu enim congue ipsum, vel aliquam ipsum urna quis tellus. Mauris at imperdiet nisi. Integer at neque ex. Nullam vel ipsum sodales, porttitor nulla vitae, tincidunt est. Pellentesque vitae lectus arcu. Integer dapibus rutrum facilisis. Nullam tincidunt quam at arcu interdum, vitae egestas libero vehicula. Morbi metus tortor, dapibus id finibus ac, egestas quis leo. Phasellus scelerisque suscipit mauris sed rhoncus. In quis ultricies ipsum. Integer vitae iaculis risus, sit amet elementum augue. Pellentesque vitae sagittis erat, eget consectetur lorem."
    _created={new Date().toISOString()}
  />
)

export const Editable: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    isEditable={true}
    _id={'abc'}
    text="Ut dignissim, odio a cursus pretium, erat ex dictum quam, a eleifend augue mauris vel metus. Suspendisse pellentesque, elit efficitur rutrum maximus, arcu enim congue ipsum, vel aliquam ipsum urna quis tellus. Mauris at imperdiet nisi. Integer at neque ex. Nullam vel ipsum sodales, porttitor nulla vitae, tincidunt est. Pellentesque vitae lectus arcu. Integer dapibus rutrum facilisis. Nullam tincidunt quam at arcu interdum, vitae egestas libero vehicula. Morbi metus tortor, dapibus id finibus ac, egestas quis leo. Phasellus scelerisque suscipit mauris sed rhoncus. In quis ultricies ipsum. Integer vitae iaculis risus, sit amet elementum augue. Pellentesque vitae sagittis erat, eget consectetur lorem."
    _created={new Date().toISOString()}
  />
)

export const Edited: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    isEditable={false}
    _id={'abc'}
    text="Ut dignissim, odio a cursus pretium, erat ex dictum quam, a eleifend augue mauris vel metus. Suspendisse pellentesque, elit efficitur rutrum maximus, arcu enim congue ipsum, vel aliquam ipsum urna quis tellus. Mauris at imperdiet nisi. Integer at neque ex. Nullam vel ipsum sodales, porttitor nulla vitae, tincidunt est. Pellentesque vitae lectus arcu. Integer dapibus rutrum facilisis. Nullam tincidunt quam at arcu interdum, vitae egestas libero vehicula. Morbi metus tortor, dapibus id finibus ac, egestas quis leo. Phasellus scelerisque suscipit mauris sed rhoncus. In quis ultricies ipsum. Integer vitae iaculis risus, sit amet elementum augue. Pellentesque vitae sagittis erat, eget consectetur lorem."
    _created={new Date().toISOString()}
    _edited={new Date().toISOString()}
  />
)

export const LongText: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    isEditable={false}
    _id={'abc'}
    text={`Ut dignissim, odio a cursus pretium, erat ex dictum quam, a eleifend augue mauris vel metus. Suspendisse pellentesque, elit efficitur rutrum maximus, arcu enim congue ipsum, vel aliquam ipsum urna quis tellus. Mauris at imperdiet nisi. Integer at neque ex. Nullam vel ipsum sodales, porttitor nulla vitae, tincidunt est. Pellentesque vitae lectus arcu. Integer dapibus rutrum facilisis. Nullam tincidunt quam at arcu interdum, vitae egestas libero vehicula. Morbi metus tortor, dapibus id finibus ac, egestas quis leo. Phasellus scelerisque suscipit mauris sed rhoncus. In quis ultricies ipsum. Integer vitae iaculis risus, sit amet elementum augue. Pellentesque vitae sagittis erat, eget consectetur lorem.\n\nUt pharetra molestie quam id dictum. In molestie, arcu sit amet faucibus pulvinar, eros erat egestas leo, at molestie nunc velit a arcu. Aliquam erat volutpat. Vivamus vehicula mi sit amet nibh auctor efficitur. Duis fermentum sem et nibh facilisis, ut tincidunt sem commodo. Nullam ornare ex a elementum accumsan. Etiam a neque ut lacus suscipit blandit. Maecenas id tortor velit.\n\nInterdum et malesuada fames ac ante ipsum primis in faucibus. Nam ut commodo tellus. Maecenas at leo metus. Vivamus ullamcorper ex purus, volutpat auctor nunc lobortis a. Integer sit amet ornare nisi, sed ultrices enim. Pellentesque ut aliquam urna, eu fringilla ante. Nullam dui nibh, feugiat id vestibulum nec, efficitur a lorem. In vitae pellentesque tellus. Pellentesque sed odio iaculis, imperdiet turpis at, aliquam ex. Praesent iaculis bibendum nibh, vel egestas turpis ultrices ac. Praesent tincidunt libero sed gravida ornare. Aliquam vehicula risus ut molestie suscipit. Nunc erat odio, venenatis nec posuere in, placerat eget massa. Sed in ultrices ex, vel egestas quam. Integer lectus magna, ornare at nisl sed, convallis euismod enim. Cras pretium commodo arcu non bibendum.\n\nNullam dictum lectus felis. Duis vitae lacus vitae nisl aliquet faucibus. Integer neque lacus, dignissim sed mi et, dignissim luctus metus. Cras sollicitudin vestibulum leo, ac ultrices sapien bibendum ac. Phasellus lobortis aliquam libero eu volutpat. Donec vitae rutrum tellus. Fusce vel ante ipsum. Suspendisse mollis tempus porta. Sed a orci tempor, rhoncus tortor eu, sodales justo.`}
    _created={new Date().toISOString()}
  />
)

export const ShortText: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    isEditable={false}
    _id={'abc'}
    text={`Ut dignissim, odio a cursus pretium.`}
    _created={new Date().toISOString()}
  />
)

export const ShortTextWithLink: StoryFn<typeof CommentItem> = () => (
  <CommentItem
    creatorName="example"
    creatorCountry="us"
    isUserVerified={true}
    isEditable={false}
    _id={'abc'}
    text={`Ut dignissim, odio a cursus pretium. https://example.com`}
    _created={new Date().toISOString()}
  />
)

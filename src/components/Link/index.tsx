import { Anchor, type AnchorProps } from '@mantine/core'
import {
  Link as LinkReactRouter,
  type LinkProps as LinkReactRouterProps,
} from 'react-router'

export default function Link(props: AnchorProps & LinkReactRouterProps) {
  return <Anchor component={LinkReactRouter} {...props} />
}

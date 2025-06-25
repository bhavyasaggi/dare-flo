import { Anchor, type AnchorProps } from '@mantine/core'
import {
  Link as LinkReactRouter,
  type LinkProps as LinkReactRouterProps,
} from 'react-router'

export default function Link(
  props: Partial<AnchorProps & LinkReactRouterProps & { href?: string }>
) {
  if (props.to) {
    return <Anchor component={LinkReactRouter} to={props.to} {...props} />
  }
  if (props.href) {
    return <Anchor component='a' href={props.href} {...props} />
  }
  return <Anchor {...props} />
}

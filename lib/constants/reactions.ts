import { ReactionType } from "../graphql/posts"
import { ThumbsUp, Heart, Sparkles, type LucideIcon } from "lucide-react"
import { FlameIcon } from "./ReactionIcons"

export interface ReactionConfig {
  type: ReactionType
  label: string
  ariaLabel: string
  icon: LucideIcon | typeof FlameIcon
  color: string
  bgColor: string
  ringColor: string
}

export const REACTIONS: ReactionConfig[] = [
  {
    type: "LIKE",
    label: "Me gusta",
    ariaLabel: "Like",
    icon: ThumbsUp,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    ringColor: "ring-green-500/50"
  },
  {
    type: "LOVE",
    label: "Me encanta",
    ariaLabel: "Love",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    ringColor: "ring-red-500/50"
  },
  {
    type: "CLAP",
    label: "Excelente",
    ariaLabel: "Excellent",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    ringColor: "ring-purple-500/50"
  },
  {
    type: "FIRE",
    label: "Increíble",
    ariaLabel: "Amazing",
    icon: FlameIcon,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    ringColor: "ring-orange-500/50"
  },
]

export function getReactionConfig(type: ReactionType): ReactionConfig | undefined {
  return REACTIONS.find((r) => r.type === type)
}

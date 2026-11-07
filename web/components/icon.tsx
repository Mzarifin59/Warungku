import {
  ArrowRight,
  Cake,
  Camera,
  Clock,
  ChevronRight,
  CupSoda,
  Headset,
  Heart,
  MonitorSmartphone,
  MapPin,
  Popcorn,
  Plus,
  Scissors,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Utensils,
  UserRound,
  UsersRound,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "arrow-right"
  | "bag"
  | "search"
  | "user"
  | "utensils"
  | "cup"
  | "popcorn"
  | "basket"
  | "cake"
  | "scissors"
  | "chevron"
  | "star"
  | "pin"
  | "shield"
  | "bolt"
  | "heart"
  | "devices"
  | "headset"
  | "plus"
  | "instagram"
  | "facebook"
  | "clock"
  | "share"
  | "x";

const icons: Record<IconName, LucideIcon> = {
  "arrow-right": ArrowRight,
  bag: ShoppingBag,
  search: Search,
  user: UserRound,
  utensils: Utensils,
  cup: CupSoda,
  popcorn: Popcorn,
  basket: ShoppingBag,
  cake: Cake,
  scissors: Scissors,
  chevron: ChevronRight,
  star: Star,
  pin: MapPin,
  shield: ShieldCheck,
  bolt: Zap,
  heart: Heart,
  devices: MonitorSmartphone,
  headset: Headset,
  plus: Plus,
  instagram: Camera,
  facebook: UsersRound,
  clock: Clock,
  share: Share2,
  x: X,
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 18, className }: IconProps) {
  const LucideIcon = icons[name];
  return <LucideIcon aria-hidden="true" className={className} size={size} />;
}

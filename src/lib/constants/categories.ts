import {
  UtensilsCrossed,
  Coffee,
  Beer,
  Hospital,
  Pill,
  Landmark,
  GraduationCap,
  Dumbbell,
  Scissors,
  ShoppingCart,
  Fuel,
  Theater,
} from "lucide-react";

export const CATEGORIES = [
  { icon: UtensilsCrossed, label: "음식점", color: "bg-orange-100 text-orange-600" },
  { icon: Coffee, label: "카페,디저트", color: "bg-amber-100 text-amber-600" },
  { icon: Beer, label: "술집", color: "bg-yellow-100 text-yellow-600" },
  { icon: Hospital, label: "병원,의원", color: "bg-red-100 text-red-600" },
  { icon: Pill, label: "건강,의료", color: "bg-green-100 text-green-600" },
  { icon: Landmark, label: "금융,보험", color: "bg-blue-100 text-blue-600" },
  { icon: GraduationCap, label: "교육,학문", color: "bg-indigo-100 text-indigo-600" },
  { icon: Dumbbell, label: "스포츠시설", color: "bg-purple-100 text-purple-600" },
  { icon: Scissors, label: "미용", color: "bg-pink-100 text-pink-600" },
  { icon: ShoppingCart, label: "생활,편의", color: "bg-teal-100 text-teal-600" },
  { icon: Fuel, label: "주유소", color: "bg-slate-100 text-slate-600" },
  { icon: Theater, label: "문화,여가", color: "bg-violet-100 text-violet-600" },
] as const;
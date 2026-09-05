import { colorNameToHex } from "@/lib/three/colorPalette";

export function ColorSwatch({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  const hex = colorNameToHex(name);

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={`flex flex-col items-center gap-1.5 ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span
        className={`h-7 w-7 rounded-full border transition-transform ${
          selected ? "scale-110 border-foreground" : "border-border-strong hover:scale-105"
        }`}
        style={{ backgroundColor: hex }}
      />
      <span className="text-[11px] capitalize text-muted">{name}</span>
    </button>
  );
}

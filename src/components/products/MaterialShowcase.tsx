import type { RecycledMaterial } from "@/lib/products";
import { TransformationVisual } from "@/components/products/TransformationVisual";

export function MaterialShowcase({ material, index, total }: { material: RecycledMaterial; index: number; total: number }) {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-[1328px] px-[5vw] pt-4">
        <div className="flex items-baseline gap-4">
          <span className="text-sm font-medium tracking-[0.2em] text-grey-400">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h4 className="text-xl font-medium text-ink uppercase">{material.name}</h4>
          <span className="text-sm text-grey-400">{material.tag}</span>
        </div>
      </div>

      <TransformationVisual material={material} />

      {material.description && (
        <div className="mx-auto max-w-[1328px] px-[5vw] pt-6 pb-24">
          <p className="max-w-md text-sm text-grey-600">{material.description}</p>
        </div>
      )}
    </div>
  );
}

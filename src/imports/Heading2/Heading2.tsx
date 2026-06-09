import svgPaths from "./svg-1x8qs6jnel";

function Divider() {
  return (
    <div className="h-[8px] relative w-full" data-name="Divider">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[4px] relative size-full">
        <div className="h-0 relative shrink-0 w-full" data-name="Divider">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 1">
              <line id="Divider" stroke="var(--stroke-0, #E5E5E5)" x2="28" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartDate() {
  return (
    <div className="h-[11.504px] relative shrink-0 w-[32.463px]" data-name="start date">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.4631 11.5039">
        <g id="start date">
          <path d={svgPaths.p1a937f00} fill="var(--fill-0, #005BC4)" id="Vector" />
          <path d={svgPaths.p206baf70} fill="var(--fill-0, #005BC4)" id="Vector_2" />
          <path d={svgPaths.p2827bf00} fill="var(--fill-0, #005BC4)" id="Vector_3" />
          <path d={svgPaths.p6c93400} fill="var(--fill-0, #005BC4)" id="Vector_4" />
          <path d={svgPaths.p247d6b80} fill="var(--fill-0, #005BC4)" id="Vector_5" />
          <path d={svgPaths.p12522500} fill="var(--fill-0, #005BC4)" id="Vector_6" />
          <path d={svgPaths.p1ca4ac40} fill="var(--fill-0, #005BC4)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#475a6b] text-[7px] whitespace-nowrap">powered by</p>
        <StartDate />
      </div>
    </div>
  );
}

export default function Heading2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center py-[10px] relative size-full" data-name="Heading 2">
      <p className="[word-break:break-word] font-['Gendy:Regular',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#005bc4] text-[28px] tracking-[-0.4395px] whitespace-nowrap">DocBuilder</p>
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0 w-[8px]" style={{ containerType: "size" }}>
          <div className="flex-none rotate-90 w-[100cqh]">
            <Divider />
          </div>
        </div>
      </div>
      <Frame />
    </div>
  );
}

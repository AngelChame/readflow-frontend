// SvgIcon.jsx
export default function IconLogo({ className }: { className?: string }) {
  return (
    <svg
      width={38}
      height={38}
      viewBox="0 0 38 38"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_i_205_95)">
        <rect width="38" height="38" fill="url(#pattern0_205_95)" />
      </g>
      <defs>
        <filter
          id="filter0_i_205_95"
          x="0"
          y="0"
          width="38"
          height="38"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-108" dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.299899 0 0 0 0 0.361693 0 0 0 0 0.893123 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_205_95" />
        </filter>
        <pattern id="pattern0_205_95" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use
            xlinkHref="#image0_205_95"
            transform="translate(-0.526316 -0.526316) scale(0.00205263)"
          />
        </pattern>
        <image
          id="image0_205_95"
          width="1000"
          height="1000"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAgAElEQVR4n..."
        />
      </defs>
    </svg>
  );
}

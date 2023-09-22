/** @jsxImportSource @emotion/react */

function CheckButton(props: {
  isSelected: boolean;
  hover: boolean;
}): JSX.Element {
  const { isSelected, hover } = props;
  const vis = hover || isSelected ? "visible" : "hidden";
  const displayCircle = hover ? "block" : "none";
  return (
    <div
      title="Select this one"
      style={{
        visibility: vis,
        background: "none",
        float: "left",
        width: "36px",
        height: "36px",
        border: "none",
        padding: "6px",
      }}
    >
      <svg
        fill={isSelected ? "#4285f4" : "grey"}
        height="36"
        viewBox="0 0 24 24"
        width="36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <radialGradient
          id="shadow"
          cx="38"
          cy="95.488"
          r="10.488"
          gradientTransform="matrix(1 0 0 -1 -26 109)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".832" stopColor="#010101"></stop>
          <stop offset="1" stopColor="#010101" stopOpacity="0"></stop>
        </radialGradient>

        <circle
          style={{ display: displayCircle }}
          opacity=".26"
          fill="url(#shadow)"
          cx="12"
          cy="13.512"
          r="10.488"
        ></circle>
        <circle
          style={{ display: displayCircle }}
          fill="#FFF"
          cx="12"
          cy="12.2"
          r="8.292"
        ></circle>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  );
}

export default CheckButton;

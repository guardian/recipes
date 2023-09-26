/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Dispatch } from "react";
import CheckButton from "./check-button";
import { ActionType } from "../interfaces/main";
import minBy from "lodash-es/minBy";
import { actions } from "../actions/recipeActions";

interface ImagePickerProps {
  isLoading: boolean;
  html: Record<string, Record<string, unknown>> | null;
  selected: string | null;
  dispatcher: Dispatch<ActionType>;
}

type assetsInfo = {
  assets: imageInfo[];
};

type imageInfo = {
  typeData: typeDataTypes;
  file: string;
};

type typeDataTypes = {
  height: string;
  width: string;
};

function findSmallestVersion(assets: imageInfo[]): imageInfo {
  /* Return asset with smallest 'width' */
  return minBy(assets, ({ typeData }) => typeData.width);
}

function getPictureUrls(elems: assetsInfo[] | undefined): string[] {
  if (elems === undefined) {
    return [];
  } else {
    return Array.from(
      elems.reduce((acc, el) => {
        const smallestAsset = findSmallestVersion(el["assets"]);
        if ("file" in smallestAsset) {
          acc.add(smallestAsset["file"]);
        }
        return acc;
      }, new Set<string>()),
    );
  }
}

function getPictureIds(elems: assetsInfo[] | undefined): string[] {
  if (elems === undefined) {
    return [];
  } else {
    return Array.from(
      elems.reduce((acc, el) => {
        if ("id" in el) {
          acc.add(el["id"]);
        }
        return acc;
      }, new Set<string>()),
    );
  }
}
// function getSelectedPic(body: Record<string, string>): string {
//   return body['picture']
// }

function select(
  objId: string,
  isSelected: boolean,
  dispatcher: Dispatch<ActionType>,
): void {
  console.log(`Object ID: ${objId}`);
  const obj = isSelected ? null : objId;
  dispatcher({
    type: actions.selectImg,
    payload: obj,
  });
}

function PictureGrid(props: {
  pics: string[];
  picIds: string[];
  selected: string | null;
  dispatcher: Dispatch<ActionType>;
}) {
  const { pics, picIds, selected, dispatcher } = props;
  const [picHovered, setHover] = useState(-1);
  return (
    <>
      <h3>{"Available Pictures: "}</h3>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "20% 20% 20% 20% 20%",
          gridTemplateRows: "auto",
          height: "auto",
          // gridTemplateRows: "40px 1fr 30px",
          gridTemplateAreas: `"1" "2" "3" "4" "5"`,
          marginBottom: "30px",
          borderColor: "black",
          borderWidth: "2px",
        }}
      >
        {pics.map((p, i) => {
          return (
            <div
              onMouseOver={() => setHover(i)}
              onMouseOut={() => setHover(-1)}
              onClick={() =>
                select(picIds[i], picIds[i] === selected, dispatcher)
              }
              css={{
                gridArea: `${Math.floor(i / 5 + 1)}`,
                background: "lightgrey",
                justifyItems: "center",
                display: "grid",
                align: "center",
                maxWidth: "100%",
                alignContent: "center",
                borderColor: "black",
                borderWidth: "1px",
                cursor: "pointer",
                pointerEvents: "visible",
              }}
              key={`img_${i}`}
            >
              <img style={{ maxWidth: "inherit" }} src={p} alt={p} />
              <div
                key={`tile-icon-bar-${i}`}
                style={{
                  pointerEvents: "none",
                  opacity: 1,
                  position: "relative",
                  top: "-90px",
                  height: "36px",
                  width: "100%",
                }}
              >
                <CheckButton
                  objId={picIds[i]}
                  isSelected={picIds[i] === selected}
                  hover={i === picHovered}
                  dispatcher={dispatcher}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ImagePicker(props: ImagePickerProps): JSX.Element {
  const { isLoading, html, selected, dispatcher } = props;
  if (isLoading || html === null) {
    return <h3> Loading pictures... </h3>;
  } else {
    const picUrls = getPictureUrls(html["elements"]);
    const picIds = getPictureIds(html["elements"]);

    return (
      <PictureGrid
        pics={picUrls}
        picIds={picIds}
        selected={selected}
        dispatcher={dispatcher}
      />
    );
  }
}

export default ImagePicker;

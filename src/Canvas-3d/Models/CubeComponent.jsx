/* eslint-disable no-unused-vars */
import { Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import { getEdgePoints } from "../Utils/EdgePointsUtils";
import { EdgeCylinder } from "./EdgeCylinder";
import * as THREE from "three";
import configValuesStore from "../../mobx/stores/configValuesStore";
import { observer } from "mobx-react-lite";
import { getPlanes } from "../Utils/ModelUtils";
import useBreakpoints from "../../hooks/useBreakpoints";

export const CubeComponent = observer(
  ({
    position,
    size,
    isVisible,
    isVisiblePanelTop,
    isVisiblePanelBottom,
    onCubeSelect,
    onPanelSelect,
    rawIndex,
    colIndex,
    width,
    height,
    depth,
  }) => {
    const { raycaster, scene, camera } = useThree();
    const [displayEdgesElement, setDisplayEdgesElement] = useState(false);
    const [displayEdgesPanel, setDisplayEdgesPanel] = useState([]);
    const breakpoint = useBreakpoints();


    const handleClick = (event, type) => {
      event.stopPropagation();

      raycaster.setFromCamera(event.pointer, event.camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const sortedIntersects = intersects.sort(
          (a, b) => a.distance - b.distance
        );

        const closestIntersect = sortedIntersects[0];

        if (
          planeRefsCube.current.some(
            (ref) => ref.current === closestIntersect.object
          )
        ) {
          if (type === "top") {
            onPanelSelect(rawIndex + 1);
          } else if (type === "bottom") {
            onPanelSelect(rawIndex);
          } else {
            onCubeSelect(rawIndex, colIndex);
          }
        }
      }
    };

    const planeRefsCube = useRef(
      Array.from({ length: 6 }, () => React.createRef())
    );

    const planes = getPlanes(height, width, depth, planeRefsCube);

    const edgePosition = [
      position[0] - width / 20,
      position[1] - height / 20,
      position[2] - depth / 20,
    ];
    const edges = getEdgePoints(edgePosition, size);
    const edgesTop = [{ indices: [2, 6, 10, 11], color: "orange" }];
    const edgesBottom = [{ indices: [0, 4, 8, 9], color: "orange" }];

    useEffect(() => {
      const handleMouseMove = (event) => {
        const mouse = new THREE.Vector2(
          (event.clientX / (window.innerWidth * 0.7)) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        setDisplayEdgesElement(false);
        setDisplayEdgesPanel([]);

        if (intersects.length > 0) {
          const closestIntersect = intersects[0];
          const detectedPlane = closestIntersect.object.name;

          const isCurrentCube = planeRefsCube.current.some(
            (ref) => ref.current === closestIntersect.object
          );

          if (closestIntersect.object.name !== "") {
            if (isCurrentCube) {
              if (detectedPlane === "bottom") {
                setDisplayEdgesPanel([
                  { indices: [0, 4, 8, 9], color: "orange" },
                ]);
              } else if (detectedPlane === "top") {
                setDisplayEdgesPanel([
                  { indices: [2, 6, 10, 11], color: "orange" },
                ]);
              } else {
                setDisplayEdgesElement(true);
              }
            }
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [raycaster, camera, scene.children, rawIndex]);

    return (
      <>
        {/* Render planes */}
        {planes.slice(0, 1).map((planeProps, index) => (
          <Plane
            ref={planeProps.ref}
            key={index}
            castShadow
            receiveShadow
            position={[
              position[0] + planeProps.position[0],
              position[1] + planeProps.position[1],
              position[2] + planeProps.position[2],
            ]}
            rotation={planeProps.rotation}
            args={[width / 10 - 1.3, depth / 10 - 1.3]}
            name={planeProps.face}
            onClick={(event) => handleClick(event, "top")}
            material={
              new THREE.MeshPhysicalMaterial({
                side: THREE.DoubleSide,
                color:
                  configValuesStore.configValues.shelfType === "acrylic"
                    ? configValuesStore.colorRows[rawIndex + 1]
                    : configValuesStore.configValues.shelfType === "stainless"
                    ? configValuesStore.configValues.color
                    : "black",
                transparent: true,
                ...(configValuesStore.configValues.shelfType === "acrylic" &&
                configValuesStore.colorRows[rawIndex + 1] != "#ffffff"
                  ? {
                      roughness: 0.1,
                      metalness: 0,
                      reflectivity: 1,
                      transmission: 0.8,
                      thickness: 0.1,
                      ior: 1.2,
                      specularIntensity: 0.1,
                      clearcoat: 0,
                      transparent: true,
                    }
                  : {
                      roughness: 0.6,
                      metalness: 0.1,
                      clearcoat: 1,
                      clearcoatRoughness: 0.2,
                    }),
              })
            }
            visible={
              !(
                configValuesStore.configValues.structureElements ===
                "withoutShelves"
              )
            }
          />
        ))}

        {rawIndex === 0 && (
          <>
            {planes.slice(1, 2).map((planeProps, index) => (
              <Plane
                ref={planeProps.ref}
                castShadow
                receiveShadow
                key={index}
                position={[
                  position[0] + planeProps.position[0],
                  position[1] + planeProps.position[1],
                  position[2] + planeProps.position[2],
                ]}
                rotation={planeProps.rotation}
                args={[width / 10 - 1.3, depth / 10 - 1.3]}
                name={planeProps.face}
                onClick={(event) => handleClick(event, "bottom")}
                material={
                  new THREE.MeshPhysicalMaterial({
                    side: THREE.DoubleSide,
                    color:
                      configValuesStore.configValues.shelfType === "acrylic"
                        ? configValuesStore.colorRows[rawIndex]
                        : configValuesStore.configValues.shelfType ===
                          "stainless"
                        ? configValuesStore.configValues.color
                        : "black",
                    transparent: true,
                    ...(configValuesStore.configValues.shelfType ===
                      "acrylic" &&
                    configValuesStore.colorRows[rawIndex] != "#ffffff"
                      ? {
                          roughness: 0.1,
                          metalness: 0,
                          reflectivity: 1,
                          transmission: 0.8,
                          thickness: 0.1,
                          ior: 1.2,
                          specularIntensity: 0.1,
                          clearcoat: 0,
                          transparent: true,
                        }
                      : {
                          roughness: 0.6,
                          metalness: 0.1,
                          clearcoat: 1,
                          clearcoatRoughness: 0.2,
                        }),
                  })
                }
                visible={
                  !(
                    configValuesStore.configValues.structureElements ===
                    "withoutShelves"
                  )
                } // Bottom plane is visible
              />
            ))}
          </>
        )}

        {planes.slice(2, 4).map((planeProps, index) => (
          <Plane
            ref={planeProps.ref}
            key={index}
            castShadow
            receiveShadow
            position={[
              position[0] + planeProps.position[0],
              position[1] + planeProps.position[1],
              position[2] + planeProps.position[2],
            ]}
            rotation={planeProps.rotation}
            args={[depth / 10 - 1.3, height / 10 - 1.3]}
            name={planeProps.face}
            onClick={(event) => handleClick(event, "cube")}
            material={
              new THREE.MeshPhysicalMaterial({
                side: THREE.DoubleSide,
                color: configValuesStore.configValues.color,
                roughness: 0.6,
                metalness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.2,
              })
            }
            visible={
              configValuesStore.configValues.structureElements === "all" ||
              configValuesStore.configValues.structureElements === "withoutBack"
            }
          />
        ))}

        {planes.slice(4, 5).map((planeProps, index) => (
          <Plane
            ref={planeProps.ref}
            key={index}
            castShadow
            receiveShadow
            position={[
              position[0] + planeProps.position[0],
              position[1] + planeProps.position[1],
              position[2] + planeProps.position[2],
            ]}
            rotation={planeProps.rotation}
            args={[width / 10 - 1.3, height / 10 - 1.3]}
            name={planeProps.face}
            onClick={(event) => handleClick(event, "cube")}
            material={
              new THREE.MeshPhysicalMaterial({
                side: THREE.DoubleSide,
                color: configValuesStore.configValues.color,
                roughness: 0.6,
                metalness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.2,
              })
            }
            visible={configValuesStore.configValues.structureElements === "all"} // Planes are invisible, but still interactable
          />
        ))}

        {/* Show edges based on selection */}
        {isVisible && (
          <>
            {edges.slice(0, 12).map((edge, index) => (
              <EdgeCylinder
                key={index}
                start={edge[0]}
                end={edge[1]}
                color={"#1E88E5"}
              />
            ))}
          </>
        )}

        {displayEdgesElement && configValuesStore.getShowHoveredEdges && ((breakpoint !== "xs" && breakpoint !== "sm") ||
        configValuesStore.currentConfigType === "structure") && (
          <>
            {edges.slice(0, 12).map((edge, index) => (
              <EdgeCylinder
                key={index}
                start={edge[0]}
                end={edge[1]}
                color={"#64B5F6"}
                radius={0.65}
              />
            ))}
          </>
        )}

        {displayEdgesPanel.length > 0 &&
          configValuesStore.configValues.shelfType === "acrylic" &&
          configValuesStore.getAllConfigValues.structureElements !==
            "withoutShelves" &&
          configValuesStore.getShowHoveredEdges &&  ((breakpoint !== "xs" && breakpoint !== "sm") ||
          configValuesStore.currentConfigType === "color") && (
            <>
              {displayEdgesPanel.map(({ indices, color }) =>
                indices.map((edgeIndex) => (
                  <EdgeCylinder
                    key={`hover-edge-${edgeIndex}`}
                    start={edges[edgeIndex][0]} // Use the stored indices to reference the edges
                    end={edges[edgeIndex][1]}
                    color={"orange"} // Use the color from displayEdges array
                  />
                ))
              )}
            </>
          )}

        {isVisiblePanelTop &&
          configValuesStore.configValues.shelfType === "acrylic" &&
          configValuesStore.getAllConfigValues.structureElements !==
            "withoutShelves" && ( // Corrected single & to &&
            <>
              {edgesTop.map(({ indices, color }) =>
                indices.map((edgeIndex) => (
                  <EdgeCylinder
                    key={`hover-edge-${edgeIndex}`}
                    start={edges[edgeIndex][0]} // Use the stored indices to reference the edges
                    end={edges[edgeIndex][1]}
                    color={"yellow"} // Use the color from displayEdges array
                  />
                ))
              )}
            </>
          )}
        {isVisiblePanelBottom &&
          configValuesStore.configValues.shelfType === "acrylic" &&
          configValuesStore.getAllConfigValues.structureElements !==
            "withoutShelves" && ( // Corrected single & to &&
            <>
              {edgesBottom.map(({ indices, color }) =>
                indices.map((edgeIndex) => (
                  <EdgeCylinder
                    key={`hover-edge-${edgeIndex}`}
                    start={edges[edgeIndex][0]} // Use the stored indices to reference the edges
                    end={edges[edgeIndex][1]}
                    color={"yellow"} // Use the color from displayEdges array
                  />
                ))
              )}
            </>
          )}
      </>
    );
  }
);

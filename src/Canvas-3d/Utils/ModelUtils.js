export const pipeConnections = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Back face
    [4, 5], [5, 6], [6, 7], [7, 4], // Front face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting front and back
];
  
export const cornerOffsets = [
  [0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], // Back face
  [0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]  // Front face
]

export  const bottomCornersIndices = [0, 1, 4, 5]; // Bottom 4 corners

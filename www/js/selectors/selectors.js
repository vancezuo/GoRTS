import {encodePos, decodePos} from '../utils/positions.js';


export const forEachBoardPos = (state, fn) => {
  const {width, height} = state;
  for (let x = 1; x < width; x++) {
    for (let y = 1; y < height; y++) {
      fn({x, y});
    }
  }
}

export const getFreePositions = (state) => {
  const freePositions = [];
  forEachBoardPos(state, (pos) => {
    if (!state.pieces[encodePos(pos)]) {
      freePositions.push(pos);
    }
  });
  return freePositions;
}

const areNeighbors = (pieceA, pieceB) => {
  if (pieceA.x == pieceB.x && Math.abs(pieceA.y - pieceB.y) == 1) {
    return true;
  }
  if (pieceA.y == pieceB.y && Math.abs(pieceA.x - pieceB.x) == 1) {
    return true;
  }
  return false;
};

const getNeighborPositions = (width, height, piece) => {
  return [
    {x: piece.x, y: piece.y + 1},
    {x: piece.x, y: piece.y - 1},
    {x: piece.x + 1, y: piece.y},
    {x: piece.x - 1, y: piece.y},
  ].filter(pos => pos.x > 0 && pos.x < width && pos.y > 0 && pos.y < height);
}

export const belongsToGroup = (group, piece) => {
  if (group.color != piece.color) return false;
  for (const encodedPiece of group.pieces) {
    if (areNeighbors(decodePos(encodedPiece), piece)) {
      return true;
    }
  }
  return false;
}

export const getNumLiberties = (state, group) => {
  const {width, height} = state;

  let numLiberties = 0;
  for (const encodedPiece of group.pieces) {
    const neighbors = getNeighborPositions(width, height, decodePos(encodedPiece));
    numLiberties += neighbors.filter(pos => !state.pieces[encodePos(pos)])
      .length;
  }

  return numLiberties;
}


// for debugging
export const getPieceGroupIndex = (state, piece) => {
  for (let i = 0; i < state.groups.length; i++) {
    const group = state.groups[i];
    for (const encodedPiece of group.pieces) {
      if (encodePos(piece) == encodedPiece) {
        return i;
      }
    }
  }
  console.log("piece not in group!", piece);
  return -1;
}

const { isNotIntersect } = require('./makeSelectSet');

function makePredictSet(selectSet) {
  if (!isNotIntersect(selectSet))
    throw new Error('The select set does not satisfy the LL(1) grammar');

  const predictSet = new Map();

  for (const [{ left, right }, sets] of selectSet) {
    sets.forEach(chain => {
      if (!predictSet.has(chain)) predictSet.set(chain, new Map());

      const chainMap = predictSet.get(chain);

      chainMap.set(left, right);
    });
  }

  return predictSet;
}

module.exports = { makePredictSet };

/**
 * @template {Record<string, unknown>} T
 * @template {string | keyof T} [Key='children']
 * @param {import('../types/main').Callback<T, Key>} callback
 * @param {import('./Node.js').Node<T, Key>} model
 * @returns {boolean}
 */
function pre(callback, model) {
  var i, childCount, keepGoing;
  keepGoing = callback(model);
  for (i = 0, childCount = model.children.length; i < childCount; i++) {
    if (keepGoing === false) {
      return false;
    }
    keepGoing = pre(callback, model.children[i]);
  }
  return keepGoing;
}

/**
 * @template {Record<string, unknown>} T
 * @template {string | keyof T} [Key='children']
 * @param {import('../types/main').Callback<T, Key>} callback
 * @param {import('./Node.js').Node<T, Key>} model
 * @returns {boolean}
 */
function post(callback, model) {
  var i, childCount, keepGoing;
  for (i = 0, childCount = model.children.length; i < childCount; i++) {
    keepGoing = post(callback, model.children[i]);
    if (keepGoing === false) {
      return false;
    }
  }
  keepGoing = callback(model);
  return keepGoing;
}

/**
 * @template {Record<string, unknown>} T
 * @template {string | keyof T} [Key='children']
 * @param {import('../types/main').Callback<T, Key>} callback
 * @param {import('./Node.js').Node<T, Key>} model
 */
function breadth(callback, model) {
  var queue = [model];
  (function processQueue() {
    var i, childCount, node;
    if (queue.length === 0) {
      return;
    }
    node = queue.shift();
    if (node) {
      for (i = 0, childCount = node.children.length; i < childCount; i++) {
        queue.push(node.children[i]);
      }
      if (callback(node) !== false) {
        processQueue();
      }
    }
  })();
}

/**
 * @template {Record<string, unknown>} T
 * @template {string | keyof T} [Key='children']
 * @type {import('../types/main').walkStrategies<T, Key>} */
export const walkStrategies = {
  pre,
  post,
  breadth,
};

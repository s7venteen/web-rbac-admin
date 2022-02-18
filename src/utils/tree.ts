type TreeNode = {
  [key: string]: any
  children?: TreeNode[]
}

export function flattenTree<T extends TreeNode>(source: T[]) {
  const result: Omit<T, 'children'>[] = []

  dfs(source)

  return result

  function dfs(items?: T[]) {
    if (!items) {
      return
    }

    for (let item of items) {
      const { children, ...other } = item
      result.push(other)
      if (item.children && item.children.length > 0) {
        dfs(item.children as T[])
      }
    }
  }
}

export type WithChildren<T> = T & { children?: WithChildren<T>[] }

type Wrapper<T> = Map<string | number, T[]>

export const buildTree = <
  ID extends string,
  PID extends string,
  T extends { [key in ID | PID]: string | number }
>(
  idKey: ID,
  parentKey: PID,
  source: T[],
) => {
  const parnetWrap = (nodes: T[]) => {
    let parnetWrapper: Wrapper<T> = new Map()

    nodes.forEach(node => {
      if (parnetWrapper.has(node[parentKey])) {
        let children = parnetWrapper.get(node[parentKey])
        children?.push(node)
      } else {
        parnetWrapper.set(node[parentKey], [node])
      }
    })

    return parnetWrapper
  }

  const topLevelWrap = (nodes: T[]) => nodes.filter(
    // @ts-ignore
    (parent) => !nodes.find(node => node[idKey] === parent[parentKey])
  )

  const build = (topLevel: T[], wrapper: Wrapper<T>): WithChildren<T>[] => {
    return topLevel.map(node => {
      if (wrapper.has(node[idKey])) {
        let children = build(wrapper.get(node[idKey]) as T[], wrapper)
        return {
          ...node,
          children,
        }
      } else {
        return node
      }
    })
  }

  const topLevelWrapper = topLevelWrap(source)
  const parnetWrapper = parnetWrap(source)

  return build(topLevelWrapper, parnetWrapper)
}
const useLayoutStart = () => {
  let layoutStart = ""
  try {
    let { height, top } = uni.getMenuButtonBoundingClientRect()
    const margin = 6
    layoutStart = height + top + margin + "px"
  } catch (e) {}
  return {
    layoutStart,
  }
}

export default useLayoutStart

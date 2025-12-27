/** 你写死的标签体系：一级 -> 二级 */
export const PRIMARY_TABS = ["All", "Algorithm", "Data Structure", "CSS", "JS"];

export const SUB_TABS = {
  Algorithm: [
    "Greedy",
    "Backtracking",
    "DynamicP",
    "Two Pointers",
    "Binary Search",
    "Sliding Window",
  ],
  "Data Structure": [
    "Array",
    "List",
    "Tree",
    "Graph",
    "Stack",
    "Queue",
    "Hash Map",
  ],
  CSS: ["Grid", "Flex", "Layout", "Animation", "Responsive"],
  JS: ["Async", "Promise", "Closure", "Array Methods", "DOM"],
  All: [],
};

/** 同标签同颜色（你写死） */
export const TAG_STYLE = {
  Algorithm: "tagGreen",
  CSS: "tagBlue",
  JS: "tagPurple",
  "Data Structure": "tagBrown",
};

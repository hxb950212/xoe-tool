// 给定 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0)。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
// 说明：你不能倾斜容器，且 n 的值至少为 2。

var maxArea = function (height) {
    let max = 0
    let left = 0
    let right = height.length - 1

    while (left < right) {
        let area = (height[left] < height[right] ? height[left] : height[right]) * (right - left)
        if (area > max) max = area

        if (height[left] < height[right]) {
            do {
                ++left
            } while (left < right && height[left - 1] >= height[left]);
        } else {
            do {
                --right
            } while (left < right && height[right + 1] >= height[right]);
        }
    }

    return max
};;

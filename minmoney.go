package main

import (
	"fmt"
)

func min(x, y int) int {
	if x < y {
		return x
	} else {
		return y
	}
}
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func cliff(nums []int) int {
	var h int
	for i := 0; i < len(nums)-1; i++ {
		h += abs(nums[i+1] - nums[i])
	}
	return h
}
func diff(left int, right int, nums []int) int {
	var diff1 int
	var diff2 int
	if right-left+1 > 10 {
		return 0
	}
	if left > 0 {
		diff1 = abs(nums[left]+1-nums[left-1]) - abs(nums[left]-nums[left-1])
	}
	if right < len(nums)-1 {
		diff2 = abs(nums[right]+1-nums[right+1]) - abs(nums[right]-nums[right+1])
	}
	diff := diff1 + diff2
	if left == right {
		if left == 0 {
			return diff
		}
		if right == len(nums)-1 {
			return diff
		}
		return diff / 2
	}
	return diff
}

func maxSub(nums []int) int {
	Steppness := cliff(nums)
	minSteppness := cliff(nums)
	for left := 0; left < len(nums); left++ {
		for right := left; right < len(nums); right++ {
			dif := diff(left, right, nums)

			if Steppness+dif < minSteppness {
				minSteppness = Steppness + dif
			}
		}
	}

	return minSteppness
}

func main() {
	var t int
	fmt.Scan(&t)

	for i := 0; i < t; i++ {

		var n int
		fmt.Scan(&n)
		arr := make([]int, n)
		for j := 0; j < n; j++ {
			fmt.Scan(&arr[j])

		}
		min := maxSub(arr)
		fmt.Println(min)

	}

}

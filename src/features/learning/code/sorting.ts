import type { SortingAlgorithmType } from "@/lib/store";

/**
 * Supported programming languages for reference implementations.
 */
export type Language = "python" | "cpp" | "java" | "javascript" | "go" | "rust";

/**
 * Display metadata for each language.
 */
export interface LanguageInfo {
  label: string;
  extension: string;
}

export const LANGUAGE_INFO: Record<Language, LanguageInfo> = {
  python: { label: "Python", extension: ".py" },
  cpp: { label: "C++", extension: ".cpp" },
  java: { label: "Java", extension: ".java" },
  javascript: { label: "JavaScript", extension: ".js" },
  go: { label: "Go", extension: ".go" },
  rust: { label: "Rust", extension: ".rs" },
};

/**
 * Ordered list of languages for consistent UI display.
 */
export const LANGUAGE_ORDER: Language[] = ["python", "javascript", "java", "cpp", "go", "rust"];

// ─────────────────────────────────────────────────────────────────────────────
// Bubble Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const BUBBLE_SORT_PYTHON = `def bubble_sort(arr: list[int]) -> None:
    """Sort array in-place using bubble sort."""
    n = len(arr)

    for i in range(n - 1):
        swapped = False

        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # Early exit if no swaps occurred
        if not swapped:
            break`;

const BUBBLE_SORT_CPP = `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // Early exit if no swaps occurred
        if (!swapped) break;
    }
}`;

const BUBBLE_SORT_JAVA = `public static void bubbleSort(int[] arr) {
    int n = arr.length;

    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;

        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }

        // Early exit if no swaps occurred
        if (!swapped) break;
    }
}`;

const BUBBLE_SORT_JS = `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Early exit if no swaps occurred
    if (!swapped) break;
  }
}`;

const BUBBLE_SORT_GO = `func bubbleSort(arr []int) {
    n := len(arr)

    for i := 0; i < n-1; i++ {
        swapped := false

        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }

        // Early exit if no swaps occurred
        if !swapped {
            break
        }
    }
}`;

const BUBBLE_SORT_RUST = `fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();

    for i in 0..n.saturating_sub(1) {
        let mut swapped = false;

        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }

        // Early exit if no swaps occurred
        if !swapped {
            break;
        }
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Selection Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const SELECTION_SORT_PYTHON = `def selection_sort(arr: list[int]) -> None:
    """Sort array in-place using selection sort."""
    n = len(arr)

    for i in range(n - 1):
        # Find minimum element in unsorted portion
        min_idx = i

        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j

        # Swap minimum with first unsorted element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]`;

const SELECTION_SORT_CPP = `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        // Find minimum element in unsorted portion
        int minIdx = i;

        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        // Swap minimum with first unsorted element
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}`;

const SELECTION_SORT_JAVA = `public static void selectionSort(int[] arr) {
    int n = arr.length;

    for (int i = 0; i < n - 1; i++) {
        // Find minimum element in unsorted portion
        int minIdx = i;

        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        // Swap minimum with first unsorted element
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`;

const SELECTION_SORT_JS = `function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Find minimum element in unsorted portion
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap minimum with first unsorted element
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
}`;

const SELECTION_SORT_GO = `func selectionSort(arr []int) {
    n := len(arr)

    for i := 0; i < n-1; i++ {
        // Find minimum element in unsorted portion
        minIdx := i

        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] {
                minIdx = j
            }
        }

        // Swap minimum with first unsorted element
        if minIdx != i {
            arr[i], arr[minIdx] = arr[minIdx], arr[i]
        }
    }
}`;

const SELECTION_SORT_RUST = `fn selection_sort(arr: &mut [i32]) {
    let n = arr.len();

    for i in 0..n.saturating_sub(1) {
        // Find minimum element in unsorted portion
        let mut min_idx = i;

        for j in (i + 1)..n {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }

        // Swap minimum with first unsorted element
        if min_idx != i {
            arr.swap(i, min_idx);
        }
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Insertion Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const INSERTION_SORT_PYTHON = `def insertion_sort(arr: list[int]) -> None:
    """Sort array in-place using insertion sort."""
    n = len(arr)

    for i in range(1, n):
        key = arr[i]
        j = i - 1

        # Shift elements greater than key to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        # Insert key at correct position
        arr[j + 1] = key`;

const INSERTION_SORT_CPP = `void insertionSort(std::vector<int>& arr) {
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Shift elements greater than key to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert key at correct position
        arr[j + 1] = key;
    }
}`;

const INSERTION_SORT_JAVA = `public static void insertionSort(int[] arr) {
    int n = arr.length;

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Shift elements greater than key to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert key at correct position
        arr[j + 1] = key;
    }
}`;

const INSERTION_SORT_JS = `function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Shift elements greater than key to the right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Insert key at correct position
    arr[j + 1] = key;
  }
}`;

const INSERTION_SORT_GO = `func insertionSort(arr []int) {
    n := len(arr)

    for i := 1; i < n; i++ {
        key := arr[i]
        j := i - 1

        // Shift elements greater than key to the right
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }

        // Insert key at correct position
        arr[j+1] = key
    }
}`;

const INSERTION_SORT_RUST = `fn insertion_sort(arr: &mut [i32]) {
    let n = arr.len();

    for i in 1..n {
        let key = arr[i];
        let mut j = i;

        // Shift elements greater than key to the right
        while j > 0 && arr[j - 1] > key {
            arr[j] = arr[j - 1];
            j -= 1;
        }

        // Insert key at correct position
        arr[j] = key;
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Gnome Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const GNOME_SORT_PYTHON = `def gnome_sort(arr: list[int]) -> None:
    """Sort array in-place using gnome sort."""
    n = len(arr)
    i = 0

    while i < n:
        if i == 0:
            i += 1
        elif arr[i] >= arr[i - 1]:
            # In order - move forward
            i += 1
        else:
            # Out of order - swap and move backward
            arr[i], arr[i - 1] = arr[i - 1], arr[i]
            i -= 1`;

const GNOME_SORT_CPP = `void gnomeSort(std::vector<int>& arr) {
    int n = arr.size();
    int i = 0;

    while (i < n) {
        if (i == 0) {
            i++;
        } else if (arr[i] >= arr[i - 1]) {
            // In order - move forward
            i++;
        } else {
            // Out of order - swap and move backward
            std::swap(arr[i], arr[i - 1]);
            i--;
        }
    }
}`;

const GNOME_SORT_JAVA = `public static void gnomeSort(int[] arr) {
    int n = arr.length;
    int i = 0;

    while (i < n) {
        if (i == 0) {
            i++;
        } else if (arr[i] >= arr[i - 1]) {
            // In order - move forward
            i++;
        } else {
            // Out of order - swap and move backward
            int temp = arr[i];
            arr[i] = arr[i - 1];
            arr[i - 1] = temp;
            i--;
        }
    }
}`;

const GNOME_SORT_JS = `function gnomeSort(arr) {
  const n = arr.length;
  let i = 0;

  while (i < n) {
    if (i === 0) {
      i++;
    } else if (arr[i] >= arr[i - 1]) {
      // In order - move forward
      i++;
    } else {
      // Out of order - swap and move backward
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      i--;
    }
  }
}`;

const GNOME_SORT_GO = `func gnomeSort(arr []int) {
    n := len(arr)
    i := 0

    for i < n {
        if i == 0 {
            i++
        } else if arr[i] >= arr[i-1] {
            // In order - move forward
            i++
        } else {
            // Out of order - swap and move backward
            arr[i], arr[i-1] = arr[i-1], arr[i]
            i--
        }
    }
}`;

const GNOME_SORT_RUST = `fn gnome_sort(arr: &mut [i32]) {
    let n = arr.len();
    let mut i = 0;

    while i < n {
        if i == 0 {
            i += 1;
        } else if arr[i] >= arr[i - 1] {
            // In order - move forward
            i += 1;
        } else {
            // Out of order - swap and move backward
            arr.swap(i, i - 1);
            i -= 1;
        }
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Quick Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_SORT_PYTHON = `def quick_sort(arr: list[int], lo: int = 0, hi: int | None = None) -> None:
    """Sort array in-place using quick sort (Lomuto partition)."""
    if hi is None:
        hi = len(arr) - 1

    if lo < hi:
        pivot_idx = partition(arr, lo, hi)
        quick_sort(arr, lo, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, hi)

def partition(arr: list[int], lo: int, hi: int) -> int:
    """Lomuto partition scheme with last element as pivot."""
    pivot = arr[hi]
    i = lo - 1

    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`;

const QUICK_SORT_CPP = `void quickSort(std::vector<int>& arr, int lo, int hi) {
    if (lo < hi) {
        int pivotIdx = partition(arr, lo, hi);
        quickSort(arr, lo, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, hi);
    }
}

int partition(std::vector<int>& arr, int lo, int hi) {
    // Lomuto partition scheme with last element as pivot
    int pivot = arr[hi];
    int i = lo - 1;

    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }

    std::swap(arr[i + 1], arr[hi]);
    return i + 1;
}`;

const QUICK_SORT_JAVA = `public static void quickSort(int[] arr, int lo, int hi) {
    if (lo < hi) {
        int pivotIdx = partition(arr, lo, hi);
        quickSort(arr, lo, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, hi);
    }
}

private static int partition(int[] arr, int lo, int hi) {
    // Lomuto partition scheme with last element as pivot
    int pivot = arr[hi];
    int i = lo - 1;

    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[hi];
    arr[hi] = temp;
    return i + 1;
}`;

const QUICK_SORT_JS = `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const pivotIdx = partition(arr, lo, hi);
    quickSort(arr, lo, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, hi);
  }
}

function partition(arr, lo, hi) {
  // Lomuto partition scheme with last element as pivot
  const pivot = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}`;

const QUICK_SORT_GO = `func quickSort(arr []int, lo, hi int) {
    if lo < hi {
        pivotIdx := partition(arr, lo, hi)
        quickSort(arr, lo, pivotIdx-1)
        quickSort(arr, pivotIdx+1, hi)
    }
}

func partition(arr []int, lo, hi int) int {
    // Lomuto partition scheme with last element as pivot
    pivot := arr[hi]
    i := lo - 1

    for j := lo; j < hi; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }

    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1
}`;

const QUICK_SORT_RUST = `fn quick_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let pivot_idx = partition(arr);
    quick_sort(&mut arr[..pivot_idx]);
    quick_sort(&mut arr[pivot_idx + 1..]);
}

fn partition(arr: &mut [i32]) -> usize {
    // Lomuto partition scheme with last element as pivot
    let hi = arr.len() - 1;
    let pivot = arr[hi];
    let mut i = 0;

    for j in 0..hi {
        if arr[j] <= pivot {
            arr.swap(i, j);
            i += 1;
        }
    }

    arr.swap(i, hi);
    i
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Merge Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const MERGE_SORT_PYTHON = `def merge_sort(arr: list[int]) -> list[int]:
    """Sort array using merge sort. Returns new sorted array."""
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    """Merge two sorted arrays into one sorted array."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result`;

const MERGE_SORT_CPP = `void mergeSort(std::vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;

    int mid = lo + (hi - lo) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}

void merge(std::vector<int>& arr, int lo, int mid, int hi) {
    std::vector<int> temp;
    int i = lo, j = mid + 1;

    while (i <= mid && j <= hi) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }

    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= hi) temp.push_back(arr[j++]);

    for (int k = 0; k < temp.size(); k++) {
        arr[lo + k] = temp[k];
    }
}`;

const MERGE_SORT_JAVA = `public static void mergeSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;

    int mid = lo + (hi - lo) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}

private static void merge(int[] arr, int lo, int mid, int hi) {
    int[] temp = new int[hi - lo + 1];
    int i = lo, j = mid + 1, k = 0;

    while (i <= mid && j <= hi) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= hi) temp[k++] = arr[j++];

    for (k = 0; k < temp.length; k++) {
        arr[lo + k] = temp[k];
    }
}`;

const MERGE_SORT_JS = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`;

const MERGE_SORT_GO = `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }

    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])

    return merge(left, right)
}

func merge(left, right []int) []int {
    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0

    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }

    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}`;

const MERGE_SORT_RUST = `fn merge_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort(&mut arr[..mid]);
    merge_sort(&mut arr[mid..]);

    let merged = merge(&arr[..mid], &arr[mid..]);
    arr.copy_from_slice(&merged);
}

fn merge(left: &[i32], right: &[i32]) -> Vec<i32> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result.push(left[i]);
            i += 1;
        } else {
            result.push(right[j]);
            j += 1;
        }
    }

    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Heap Sort Implementations
// ─────────────────────────────────────────────────────────────────────────────

const HEAP_SORT_PYTHON = `def heap_sort(arr: list[int]) -> None:
    """Sort array in-place using heap sort."""
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr: list[int], n: int, i: int) -> None:
    """Maintain max-heap property for subtree rooted at index i."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`;

const HEAP_SORT_CPP = `void heapSort(std::vector<int>& arr) {
    int n = arr.size();

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`;

const HEAP_SORT_JAVA = `public static void heapSort(int[] arr) {
    int n = arr.length;

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}

private static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`;

const HEAP_SORT_JS = `function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest])
    largest = left;
  if (right < n && arr[right] > arr[largest])
    largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`;

const HEAP_SORT_GO = `func heapSort(arr []int) {
    n := len(arr)

    // Build max heap
    for i := n/2 - 1; i >= 0; i-- {
        heapify(arr, n, i)
    }

    // Extract elements from heap one by one
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    }
}

func heapify(arr []int, n, i int) {
    largest := i
    left := 2*i + 1
    right := 2*i + 2

    if left < n && arr[left] > arr[largest] {
        largest = left
    }
    if right < n && arr[right] > arr[largest] {
        largest = right
    }

    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    }
}`;

const HEAP_SORT_RUST = `fn heap_sort(arr: &mut [i32]) {
    let n = arr.len();

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(arr, i, 0);
    }
}

fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if left < n && arr[left] > arr[largest] {
        largest = left;
    }
    if right < n && arr[right] > arr[largest] {
        largest = right;
    }

    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Complete Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reference implementations of all sorting algorithms in multiple languages.
 * These are clean, idiomatic implementations suitable for learning and comparison.
 */
export const SORTING_IMPLEMENTATIONS: Record<SortingAlgorithmType, Record<Language, string>> = {
  bubble: {
    python: BUBBLE_SORT_PYTHON,
    cpp: BUBBLE_SORT_CPP,
    java: BUBBLE_SORT_JAVA,
    javascript: BUBBLE_SORT_JS,
    go: BUBBLE_SORT_GO,
    rust: BUBBLE_SORT_RUST,
  },
  selection: {
    python: SELECTION_SORT_PYTHON,
    cpp: SELECTION_SORT_CPP,
    java: SELECTION_SORT_JAVA,
    javascript: SELECTION_SORT_JS,
    go: SELECTION_SORT_GO,
    rust: SELECTION_SORT_RUST,
  },
  insertion: {
    python: INSERTION_SORT_PYTHON,
    cpp: INSERTION_SORT_CPP,
    java: INSERTION_SORT_JAVA,
    javascript: INSERTION_SORT_JS,
    go: INSERTION_SORT_GO,
    rust: INSERTION_SORT_RUST,
  },
  gnome: {
    python: GNOME_SORT_PYTHON,
    cpp: GNOME_SORT_CPP,
    java: GNOME_SORT_JAVA,
    javascript: GNOME_SORT_JS,
    go: GNOME_SORT_GO,
    rust: GNOME_SORT_RUST,
  },
  quick: {
    python: QUICK_SORT_PYTHON,
    cpp: QUICK_SORT_CPP,
    java: QUICK_SORT_JAVA,
    javascript: QUICK_SORT_JS,
    go: QUICK_SORT_GO,
    rust: QUICK_SORT_RUST,
  },
  merge: {
    python: MERGE_SORT_PYTHON,
    cpp: MERGE_SORT_CPP,
    java: MERGE_SORT_JAVA,
    javascript: MERGE_SORT_JS,
    go: MERGE_SORT_GO,
    rust: MERGE_SORT_RUST,
  },
  heap: {
    python: HEAP_SORT_PYTHON,
    cpp: HEAP_SORT_CPP,
    java: HEAP_SORT_JAVA,
    javascript: HEAP_SORT_JS,
    go: HEAP_SORT_GO,
    rust: HEAP_SORT_RUST,
  },
};

/**
 * Get the implementation of a sorting algorithm in a specific language.
 */
export function getSortingImplementation(
  algorithm: SortingAlgorithmType,
  language: Language
): string {
  return SORTING_IMPLEMENTATIONS[algorithm][language];
}

/**
 * Get all implementations for a specific algorithm.
 */
export function getAllImplementations(algorithm: SortingAlgorithmType): Record<Language, string> {
  return SORTING_IMPLEMENTATIONS[algorithm];
}

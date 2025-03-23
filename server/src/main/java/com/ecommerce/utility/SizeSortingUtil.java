package com.ecommerce.utility;

import com.ecommerce.model.Size;

import java.util.*;
import java.util.stream.Collectors;

public class SizeSortingUtil {

    private static final List<String> SIZE_ORDER = List.of(
            "XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40"
    );

    private static final Map<String, Integer> SIZE_PRIORITY_MAP = new HashMap<>();

    static {
        for (int i = 0; i < SIZE_ORDER.size(); i++) {
            SIZE_PRIORITY_MAP.put(SIZE_ORDER.get(i), i);
        }
    }

    public static Comparator<Size> getSizeComparator() {
        return Comparator.comparingInt(size -> SIZE_PRIORITY_MAP.getOrDefault(size.getName(), Integer.MAX_VALUE));
    }

    public static Set<Size> sortSizes(Set<Size> sizes) {
        return sizes.stream()
                .sorted(getSizeComparator())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

}

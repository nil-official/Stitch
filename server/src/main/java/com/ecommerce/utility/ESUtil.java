package com.ecommerce.utility;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;

import java.util.function.Supplier;

public class ESUtil {

    public static Supplier<Query> createSupplierAutoSuggest(String partialProductName) {
        return () -> Query.of(q -> q.matchPhrasePrefix(m -> m
                .field("title")
                .query(partialProductName)
        ));
    }

}

package com.ecommerce.utility;

import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import lombok.val;

import java.util.function.Supplier;

public class ESUtil {

    public static Supplier<Query> createSupplierAutoSuggest(String partialProductName) {
        return () -> Query.of(q -> q.match(createAutoSuggestMatchQuery(partialProductName)));
    }

    public static MatchQuery createAutoSuggestMatchQuery(String partialProductName) {
        val autoSuggestQuery = new MatchQuery.Builder();
        return autoSuggestQuery.field("title").query(partialProductName).analyzer("standard").build();
    }

}

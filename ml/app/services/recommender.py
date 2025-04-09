import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

BAD_RANK_THRESHOLD = 4.0

_df = pd.read_json("./data/totalMlProducts.json")
_df['rankScore'] = _df['rankScore'].fillna(0)
scaler = MinMaxScaler()
_df['rankScore_norm'] = scaler.fit_transform(_df[['rankScore']])
enc = OneHotEncoder()
encoded = enc.fit_transform(_df[['category', 'color', 'brand']]).toarray()
encoded_df = pd.DataFrame(encoded, columns=enc.get_feature_names_out())
corpus = (_df['title'] + ' ' + _df['description']).str.lower()
vectorizer = TfidfVectorizer(max_features=50, stop_words='english')
keyword_matrix = vectorizer.fit_transform(corpus).toarray()
keyword_columns = ['kw_' + word for word in vectorizer.get_feature_names_out()]
keywords_matrix = pd.DataFrame(keyword_matrix, columns=keyword_columns)
features = pd.concat([_df[['rankScore_norm']], encoded_df.reset_index(drop=True), keywords_matrix.reset_index(drop=True)], axis=1)
weights = np.array([5] + [1] * (features.shape[1] - 1))
weighted_features = features * weights
similarity = cosine_similarity(weighted_features)

def get_recommendations(product_id, top_n):
    if product_id not in _df['id'].values:
        return {"error": "Invalid product_id"}
    idx = _df[_df['id'] == product_id].index[0]
    base_category = _df.loc[idx, 'category']
    base_brand = _df.loc[idx, 'brand']
    sim_scores = list(enumerate(similarity[idx]))
    for i, (index, score) in enumerate(sim_scores):
        if index == idx: continue
        if _df.loc[index, 'category'] == base_category: score += 0.8
        if _df.loc[index, 'brand'] == base_brand: score += 0.5
        sim_scores[i] = (index, score)
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    def is_good_or_unrated(score): return score == 0.0 or score > BAD_RANK_THRESHOLD
    same_cat_high = [i for i, _ in sim_scores if _df.loc[i, 'category'] == base_category and is_good_or_unrated(_df.loc[i, 'rankScore']) and i != idx]
    other_cat_high = [i for i, _ in sim_scores if _df.loc[i, 'category'] != base_category and is_good_or_unrated(_df.loc[i, 'rankScore'])]
    same_cat_zero = [i for i, _ in sim_scores if _df.loc[i, 'category'] == base_category and _df.loc[i, 'rankScore'] == 0.0 and i != idx]
    other_cat_zero = [i for i, _ in sim_scores if _df.loc[i, 'category'] != base_category and _df.loc[i, 'rankScore'] == 0.0 and i != idx]
    n_same = int(top_n * 0.72)
    n_other = int(top_n * 0.22)
    n_zero = top_n - (n_same + n_other)
    selected_same_zero = same_cat_zero[:max(1, min(len(same_cat_zero), n_zero))]
    selected_other_zero = other_cat_zero[:1] if other_cat_zero else []
    zero_taken = len(selected_same_zero) + len(selected_other_zero)
    remaining_zero = max(0, n_zero - zero_taken)
    selected_remaining_zero = (same_cat_zero[len(selected_same_zero):] + other_cat_zero[len(selected_other_zero):])[:remaining_zero]
    selected_same = same_cat_high[:n_same]
    selected_other = other_cat_high[:n_other]
    selected_zero = selected_same_zero + selected_other_zero + selected_remaining_zero
    selected_indices = selected_same + selected_other + selected_zero
    results = _df.iloc[selected_indices][['id', 'title', 'rankScore', 'category', 'brand', 'description', 'color']]
    return results.to_dict(orient='records')
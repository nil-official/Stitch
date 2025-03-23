package com.ecommerce.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int price;

    private int discountedPrice;

    private int discountPercent;

    private int quantity;

    private String brand;

    private String color;

    private boolean isFeatured = false;

    @ElementCollection
    private Set<Size> sizes = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String preview;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    private double averageRating = 0.0;

    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;

    private double sort_score = 0.0;

    private LocalDateTime createdAt;

    @Override
    public int hashCode() {
        return Objects.hash(brand, category, color, description, discountPercent, discountedPrice, id, preview,
                images, averageRating, price, quantity, reviews, sizes, title, isFeatured);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Product other = (Product) obj;
        return Objects.equals(brand, other.brand) && Objects.equals(category, other.category)
                && Objects.equals(color, other.color) && Objects.equals(description, other.description)
                && discountPercent == other.discountPercent && discountedPrice == other.discountedPrice
                && Objects.equals(id, other.id) && Objects.equals(preview, other.preview)
                && averageRating == other.averageRating && price == other.price
                && quantity == other.quantity && Objects.equals(reviews, other.reviews)
                && Objects.equals(sizes, other.sizes) && Objects.equals(title, other.title)
                && isFeatured == other.isFeatured && Objects.equals(images, other.images);
    }

}

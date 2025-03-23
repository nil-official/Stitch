package com.ecommerce.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Size {

    private String name;
    private int quantity;

}

package com.ecommerce.repository;

import com.ecommerce.model.User;
import com.ecommerce.model.VerifyToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerifyTokenRepository extends JpaRepository<VerifyToken, Long> {

    Optional<VerifyToken> findByUser(User user);

    Optional<VerifyToken> findByToken(String token);

    void deleteByUser(User user);

}

package com.ecommerce.utility;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;

public class AgeUtil {

    public static int calculateAge(Date dob) {
        if (dob == null) return 0;

        LocalDate birthDate = dob.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate today = LocalDate.now();

        return Period.between(birthDate, today).getYears();
    }

}

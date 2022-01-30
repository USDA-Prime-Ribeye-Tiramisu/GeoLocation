package com.dallas.rent.geolocation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.dallas.rent.geolocation.model.Dallas;
import com.vividsolutions.jts.geom.Point;

@Repository
public interface DallasRepository extends JpaRepository<Dallas, Long> {

    @Query(value="SELECT * from dallas_rent where ST_DistanceSphere(geom, ST_MakePoint(:lon, :lat)) <= :distanceM * 1609.34", nativeQuery = true)
    List<Dallas> findNearWithinDistnace(@Param("lon") Integer lon, @Param("lat") Integer lat, @Param("distanceM") double distanceM);

    @Query(value="SELECT * from dallas_rent", nativeQuery = true)
    List<Dallas> findAll();
}

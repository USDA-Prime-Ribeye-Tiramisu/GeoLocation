package com.dallas.rent.geolocation.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.vividsolutions.jts.geom.Point;

import lombok.Data;

@Data
@Entity
@Table(name = "dallas_rent")
public class Dallas {

    @Id
    @Column(name = "mls")
    private String mls;

    @Column(name = "rent")
    private Integer rent;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "geom")
    private Point geometry;

    public String getMls() {
        return this.mls;
    }

    public String getLat() {
        return this.latitude;
    }

    public String getLong() {
        return this.longitude;
    }

    public Integer getRent() {
        return this.rent;
    }

    public Point getGeometry() {
        return this.geometry;
    }

    public void setMls(String mls) {
        this.mls = mls;
    }

    public void setLat(String lat) {
        this.latitude = lat;
    }

    public void setLong(String lon) {
        this.longitude = lon;
    }

    public void setRent(Integer rent) {
        this.rent = rent;
    }

    public void setGeometry(Point geometry) {
        this.geometry = geometry;
    }
}

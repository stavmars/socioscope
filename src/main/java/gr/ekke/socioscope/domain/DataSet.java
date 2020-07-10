package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * A DataSet.
 */
@Document(collection = "data_set")
public class DataSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @NotNull
    @Size(min = 2)
    @Field("type")
    private String type;

    @Field("comment")
    private Map<String, String> comment;

    @Field("sources")
    private Map<String, String> sources;

    @CreatedDate
    private Instant createdDate;

    @DBRef
    @Field("dimensions")
    private List<Dimension> dimensions = new ArrayList<>();

    private List<DimensionGroup> dimensionGroups = new ArrayList<>();

    @DBRef
    @Field("measures")
    private List<Measure> measures = new ArrayList<>();

    @Field("highlights")
    private List<Highlight> highlights = new ArrayList<>();

    @Field("defaultOptions")
    private SeriesOptions defaultOptions;

    @Field("colorScheme")
    private String colorScheme;

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public DataSet name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public DataSet type(String type) {
        this.type = type;
        return this;
    }

    public SeriesOptions getDefaultOptions() {
        return defaultOptions;
    }

    public void setDefaultOptions(SeriesOptions defaultOptions) {
        this.defaultOptions = defaultOptions;
    }

    public DataSet defaultOptions(SeriesOptions defaultOptions) {
        this.defaultOptions = defaultOptions;
        return this;
    }

    public String getColorScheme() {
        return colorScheme;
    }

    public void setColorScheme(String colorScheme) {
        this.colorScheme = colorScheme;
    }

    public DataSet colorScheme(String colorScheme) {
        this.colorScheme = colorScheme;
        return this;
    }

    public Map<String, String> getComment() {
        return comment;
    }

    public void setComment(Map<String, String> comment) {
        this.comment = comment;
    }

    public DataSet comment(Map<String, String> comment) {
        this.comment = comment;
        return this;
    }

    public Map<String, String> getSources() {
        return sources;
    }

    public void setSources(Map<String, String> sources) {
        this.sources = sources;
    }

    public DataSet sources(Map<String, String> sources) {
        this.sources = sources;
        return this;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public DataSet createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public List<Dimension> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
    }

    public DataSet dimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
        return this;
    }

    public DataSet removeDimension(Dimension dimension) {
        this.dimensions.remove(dimension);
        return this;
    }

    public List<DimensionGroup> getDimensionGroups() {
        return dimensionGroups;
    }

    public void setDimensionGroups(List<DimensionGroup> dimensionGroups) {
        this.dimensionGroups = dimensionGroups;
    }

    public List<Measure> getMeasures() {
        return measures;
    }

    public void setMeasures(List<Measure> measures) {
        this.measures = measures;
    }

    public DataSet measures(List<Measure> measures) {
        this.measures = measures;
        return this;
    }

    public DataSet removeMeasure(Measure measure) {
        this.measures.remove(measure);
        return this;
    }

    public List<Highlight> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<Highlight> highlights) {
        this.highlights = highlights;
    }

    public DataSet addHighlights(List<Highlight> highlights) {
        this.highlights.addAll(highlights);
        return this;
    }

    public DataSet removeHighlight(Highlight highlight) {
        this.highlights.remove(highlight);
        return this;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public DataSet creator(User user) {
        this.creator = user;
        return this;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DataSet dataSet = (DataSet) o;
        if (dataSet.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataSet.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataSet{" +
            "id='" + id + '\'' +
            ", name=" + name +
            ", type='" + type + '\'' +
            ", comment=" + comment +
            ", sources=" + sources +
            ", createdDate=" + createdDate +
            ", dimensions=" + dimensions +
            ", dimensionGroups=" + dimensionGroups +
            ", measures=" + measures +
            ", highlights=" + highlights +
            ", defaultOptions=" + defaultOptions +
            ", colorScheme='" + colorScheme + '\'' +
            ", creator=" + creator +
            '}';
    }
}

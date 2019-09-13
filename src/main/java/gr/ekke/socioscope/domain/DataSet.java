package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.*;

/**
 * A DataSet.
 */
@Document(collection = "data_set")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "dataset")
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

    public DataSet name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public DataSet type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public SeriesOptions getDefaultOptions() {
        return defaultOptions;
    }

    public DataSet defaultOptions(SeriesOptions defaultOptions) {
        this.defaultOptions = defaultOptions;
        return this;
    }

    public void setDefaultOptions(SeriesOptions defaultOptions) {
        this.defaultOptions = defaultOptions;
    }

    public String getColorScheme() {
        return colorScheme;
    }

    public DataSet colorScheme(String colorScheme) {
        this.colorScheme = colorScheme;
        return this;
    }

    public void setColorScheme(String colorScheme) {
        this.colorScheme = colorScheme;
    }

    public Map<String, String> getComment() {
        return comment;
    }

    public DataSet comment(Map<String, String> comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(Map<String, String> comment) {
        this.comment = comment;
    }

    public Map<String, String> getSources() {
        return sources;
    }

    public DataSet sources(Map<String, String> sources) {
        this.sources = sources;
        return this;
    }
    
    public void setSources(Map<String, String> sources) {
        this.sources = sources;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public DataSet createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public List<Dimension> getDimensions() {
        return dimensions;
    }

    public DataSet dimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
        return this;
    }

    public DataSet removeDimension(Dimension dimension) {
        this.dimensions.remove(dimension);
        return this;
    }

    public void setDimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
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

    public DataSet measures(List<Measure> measures) {
        this.measures = measures;
        return this;
    }

    public DataSet removeMeasure(Measure measure) {
        this.measures.remove(measure);
        return this;
    }

    public void setMeasures(List<Measure> measures) {
        this.measures = measures;
    }

    public List<Highlight> getHighlights() {
        return highlights;
    }

    public DataSet addHighlights(List<Highlight> highlights) {
        this.highlights.addAll(highlights);
        return this;
    }

    public DataSet removeHighlight(Highlight highlight) {
        this.highlights.remove(highlight);
        return this;
    }

    public void setHighlights(List<Highlight> highlights) {
        this.highlights = highlights;
    }

    public User getCreator() {
        return creator;
    }

    public DataSet creator(User user) {
        this.creator = user;
        return this;
    }

    public void setCreator(User user) {
        this.creator = user;
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
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}

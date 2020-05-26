package gr.ekke.socioscope.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A NewsPost.
 */
@Document(collection = "news_post")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "newspost")
public class NewsPost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("content")
    private String content;

    @Field("preview_image")
    private byte[] previewImage;

    @Field("preview_image_content_type")
    private String previewImageContentType;

    @Field("preview_title")
    private String previewTitle;

    @Field("preview_subtitle")
    private String previewSubtitle;

    @Field("published")
    private Boolean published;

    @Field("post_date")
    private Instant postDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public NewsPost content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public byte[] getPreviewImage() {
        return previewImage;
    }

    public NewsPost previewImage(byte[] previewImage) {
        this.previewImage = previewImage;
        return this;
    }

    public void setPreviewImage(byte[] previewImage) {
        this.previewImage = previewImage;
    }

    public String getPreviewImageContentType() {
        return previewImageContentType;
    }

    public NewsPost previewImageContentType(String previewImageContentType) {
        this.previewImageContentType = previewImageContentType;
        return this;
    }

    public void setPreviewImageContentType(String previewImageContentType) {
        this.previewImageContentType = previewImageContentType;
    }

    public String getPreviewTitle() {
        return previewTitle;
    }

    public NewsPost previewTitle(String previewTitle) {
        this.previewTitle = previewTitle;
        return this;
    }

    public void setPreviewTitle(String previewTitle) {
        this.previewTitle = previewTitle;
    }

    public String getPreviewSubtitle() {
        return previewSubtitle;
    }

    public NewsPost previewSubtitle(String previewSubtitle) {
        this.previewSubtitle = previewSubtitle;
        return this;
    }

    public void setPreviewSubtitle(String previewSubtitle) {
        this.previewSubtitle = previewSubtitle;
    }

    public Boolean isPublished() {
        return published;
    }

    public NewsPost published(Boolean published) {
        this.published = published;
        return this;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Instant getPostDate() {
        return postDate;
    }

    public NewsPost postDate(Instant postDate) {
        this.postDate = postDate;
        return this;
    }

    public void setPostDate(Instant postDate) {
        this.postDate = postDate;
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
        NewsPost newsPost = (NewsPost) o;
        if (newsPost.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), newsPost.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "NewsPost{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", previewImage='" + getPreviewImage() + "'" +
            ", previewImageContentType='" + getPreviewImageContentType() + "'" +
            ", previewTitle='" + getPreviewTitle() + "'" +
            ", previewSubtitle='" + getPreviewSubtitle() + "'" +
            ", published='" + isPublished() + "'" +
            ", postDate='" + getPostDate() + "'" +
            "}";
    }
}

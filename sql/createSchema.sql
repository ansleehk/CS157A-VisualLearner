CREATE TABLE Learner (
    LearnerID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50),
    Password VARCHAR(50),
    Email VARCHAR(100)
);

CREATE TABLE Article (
    ArticleID VARCHAR(255) PRIMARY KEY,
    Title VARCHAR(255),
    Content TEXT,
    SourceLink VARCHAR(255),
    ConceptMapCode TEXT 
);

CREATE TABLE Concept (
    ConceptID INT PRIMARY KEY AUTO_INCREMENT,
    ConceptName VARCHAR(100)
);

CREATE TABLE StudyField (
    FieldID INT PRIMARY KEY AUTO_INCREMENT,
    FieldName VARCHAR(100)
);

CREATE TABLE ArticleConcept (
    ArticleID VARCHAR(255),
    ConceptID INT,
    FOREIGN KEY (ArticleID) REFERENCES Article(ArticleID) ON DELETE CASCADE,
    FOREIGN KEY (ConceptID) REFERENCES Concept(ConceptID) ON DELETE CASCADE,
    PRIMARY KEY (ArticleID, ConceptID)
);

CREATE TABLE ConceptRelationship (
    RelationshipID INT PRIMARY KEY AUTO_INCREMENT,
    Concept1ID INT,
    Concept2ID INT,
    RelationshipDescription TEXT,
    FOREIGN KEY (Concept1ID) REFERENCES Concept(ConceptID) ON DELETE CASCADE,
    FOREIGN KEY (Concept2ID) REFERENCES Concept(ConceptID) ON DELETE CASCADE
);

CREATE TABLE UserFollow (
    FollowID INT PRIMARY KEY AUTO_INCREMENT,
    FollowerID INT,
    FolloweeID INT,
    FOREIGN KEY (FollowerID) REFERENCES Learner(LearnerID) ON DELETE CASCADE,
    FOREIGN KEY (FolloweeID) REFERENCES Learner(LearnerID) ON DELETE CASCADE
);

CREATE TABLE LearnerReadArticle (
    LearnerID INT,
    ArticleID VARCHAR(255),
    FOREIGN KEY (LearnerID) REFERENCES Learner(LearnerID) ON DELETE CASCADE,
    FOREIGN KEY (ArticleID) REFERENCES Article(ArticleID) ON DELETE CASCADE,
    PRIMARY KEY (LearnerID, ArticleID)
);

CREATE TABLE LearnerKnownField (
    LearnerID INT,
    FieldID INT,
    FOREIGN KEY (LearnerID) REFERENCES Learner(LearnerID) ON DELETE CASCADE,
    FOREIGN KEY (FieldID) REFERENCES StudyField(FieldID) ON DELETE CASCADE,
    PRIMARY KEY (LearnerID, FieldID)
);

CREATE TABLE ArticleRelatedField (
    ArticleID VARCHAR(255),
    FieldID INT,
    FOREIGN KEY (ArticleID) REFERENCES Article(ArticleID) ON DELETE CASCADE,
    FOREIGN KEY (FieldID) REFERENCES StudyField(FieldID) ON DELETE CASCADE,
    PRIMARY KEY (ArticleID, FieldID)
);

from collections import Counter
import numpy as np
from numpy.linalg import norm

SKILL_WEIGHT = 0.4
SALARY_WEIGHT = 0.2
EXPERIENCE_WEIGHT = 0.2
CATEGORY_WEIGHT = 0.2


def vectorize(keywords, bow):
    return [bow[k] for k in keywords]


def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (norm(v1) * norm(v2))


def calculate_candidate_quality(vacancy, candidate):
    vacancy_skills = vacancy.skills.values_list('name', flat=True)
    candidate_skills = candidate.skills.values_list('name', flat=True)

    vacancy_bow = Counter(vacancy_skills)
    candidate_bow = Counter(candidate_skills)

    all_skills = vacancy_bow | candidate_bow

    v1 = vectorize(all_skills, candidate_bow)
    v2 = vectorize(all_skills, vacancy_bow)

    skill_match = cosine_similarity(v1, v2)
    salary_match = 1 - abs(vacancy.salary - candidate.salary) / max(vacancy.salary, candidate.salary)
    category_match = 1 if vacancy.category == candidate.category else 0
    experience_match = min(candidate.experience / vacancy.experience, 1)

    return (SKILL_WEIGHT * skill_match +
            EXPERIENCE_WEIGHT * experience_match +
            CATEGORY_WEIGHT * category_match +
            SALARY_WEIGHT * salary_match)

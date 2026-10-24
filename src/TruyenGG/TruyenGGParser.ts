import { CheerioAPI } from 'cheerio';
import {
    Chapter,
    SourceManga,
    Tag,
    TagSection,
    PartialSourceManga
} from '@paperback/types';

export class Parser {

    convertTime(timeAgo: string): Date {
        let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
        trimmed = (trimmed === 0 && timeAgo.includes('a')) ? 1 : trimmed;

        if (timeAgo.includes('giây') || timeAgo.includes('secs')) {
            return new Date(Date.now() - trimmed * 1000);
        } else if (timeAgo.includes('phút')) {
            return new Date(Date.now() - trimmed * 60000);
        } else if (timeAgo.includes('giờ')) {
            return new Date(Date.now() - trimmed * 3600000);
        } else if (timeAgo.includes('ngày')) {
            return new Date(Date.now() - trimmed * 86400000);
        } else if (timeAgo.includes('năm')) {
            return new Date(Date.now() - trimmed * 31556952000);
        } else if (timeAgo.includes(':')) {
            const [H, D] = timeAgo.split(' ');
            const fixD = String(D).split('/');
            const finalD = `${fixD[1]}/${fixD[0]}/${new Date().getFullYear()}`;
            return new Date(`${finalD} ${H}`);
        } else if (timeAgo.includes('/')) {
            const split = timeAgo.split('/');
            if (split.length === 3) {
                return new Date(`${split[1]}/${split[0]}/${split[2]}`);
            }
        }
        return new Date();
    }

    parseCards($: CheerioAPI): PartialSourceManga[] {
        const cards: PartialSourceManga[] = [];
        const seen = new Set<string>();

        $('ul.list_grid > li').each((_, el) => {
            const a = $(el).find('.book_name a, .book_avatar a, h3 a').first();
            const href = a.attr('href') || '';
            const mangaId = href.replace(/^https?:\/\/[^/]+\/truyen-tranh\//, '').replace(/^\/truyen-tranh\//, '').trim();
            const title = (a.attr('title') || a.text().trim() || $(el).find('img').attr('alt') || '').trim();
            
            const imgEl = $(el).find('.book_avatar img, img').first();
            const image = (imgEl.attr('src') || imgEl.attr('data-fb') || imgEl.attr('data-original') || '').trim();
            const subtitle = $(el).find('.last_chapter a').first().text().trim() || undefined;

            if (mangaId && title && !seen.has(mangaId)) {
                seen.add(mangaId);
                cards.push(App.createPartialSourceManga({
                    mangaId,
                    title,
                    image,
                    subtitle,
                }));
            }
        });

        return cards;
    }

    parseSearchAjax($: CheerioAPI): PartialSourceManga[] {
        const results: PartialSourceManga[] = [];
        const seen = new Set<string>();

        $('li').each((_, el) => {
            const a = $(el).find('a').first();
            const href = a.attr('href') || '';
            const mangaId = href.replace(/^https?:\/\/[^/]+\/truyen-tranh\//, '').replace(/^\/truyen-tranh\//, '').trim();
            const title = ($(el).find('.name, .search_info p').first().text().trim() || a.text().trim()).trim();
            
            const img = $(el).find('img').first();
            const image = (img.attr('src') || img.attr('data-fb') || img.attr('data-original') || '').trim();
            const subtitle = $(el).find('.search_info p:not(.name), p.more-info').first().text().trim() || undefined;

            if (mangaId && title && !seen.has(mangaId)) {
                seen.add(mangaId);
                results.push(App.createPartialSourceManga({
                    mangaId,
                    title,
                    image,
                    subtitle,
                }));
            }
        });

        return results;
    }

    parseMangaDetails($: CheerioAPI, mangaId: string): SourceManga {
        const tags: Tag[] = [];

        $('a[href*="/the-loai/"], ul.list01 a, .list-tags a').each((_, obj) => {
            const label = $(obj).text().trim();
            const href = $(obj).attr('href') || '';
            const m = href.match(/\/the-loai\/([a-zA-Z0-9_-]+)\.html/);
            const id = m ? m[1] : label;
            if (label && !tags.some(t => t.id === id)) {
                tags.push(App.createTag({ label, id }));
            }
        });

        const title = $('.book_other h1').text().trim() || $('h1').first().text().trim() || mangaId;
        const rawAltTitles = $('.title-more-other').text().replace(/^Tên khác:\s*/i, '').trim();
        const titles = [title];
        if (rawAltTitles) {
            for (const alt of rawAltTitles.split(';')) {
                const cleanAlt = alt.trim();
                if (cleanAlt && !titles.includes(cleanAlt)) {
                    titles.push(cleanAlt);
                }
            }
        }

        const author = $('ul.list-info > li.author > p.col-xs-9, ul.list-info > li.author').text().replace(/^Tác giả:\s*/i, '').trim();
        const status = $('ul.list-info > li.status > p.col-xs-9, ul.list-info > li.status').text().replace(/^Tình trạng:\s*/i, '').trim();
        const imgEl = $('.book_avatar img').first();
        const image = imgEl.attr('src') || imgEl.attr('data-fb') || imgEl.attr('data-original') || '';
        const desc = $('div.detail-content > p').text().trim() || $('.excerpt').text().trim();

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles,
                author: author || undefined,
                image,
                desc: desc || '',
                status: status || 'Đang cập nhật',
                tags: [App.createTagSection({ id: '0', label: 'genres', tags })]
            })
        });
    }

    parseChapterList($: CheerioAPI): Chapter[] {
        const chapters: Chapter[] = [];

        $('.works-chapter-list .works-chapter-item').each((_, obj) => {
            const a = $(obj).find('.name-chap a, a').first();
            const href = a.attr('href') || '';
            const id = href.replace(/^https?:\/\/[^/]+\/truyen-tranh\//, '').replace(/^\/truyen-tranh\//, '').trim();
            const name = a.text().trim();
            if (!id || !name) return;

            const timeText = $(obj).find('.time-chap, .col-md-2').text().trim();
            const timeFinal = this.convertTime(timeText);
            const numMatch = name.match(/(?:chap(?:ter)?|chương)\s*([\d.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;

            chapters.push(App.createChapter({
                id,
                chapNum,
                name,
                langCode: '🇻🇳',
                time: timeFinal
            }));
        });

        if (chapters.length === 0) {
            throw new Error('No chapters found');
        }

        return chapters;
    }

    parseChapterDetails($: CheerioAPI): string[] {
        const pages: string[] = [];

        $('.chapter_content img, .page-chapter img').each((_, obj) => {
            const src = $(obj).attr('src') || $(obj).attr('data-original') || $(obj).attr('data-cdn') || $(obj).attr('data-src');
            if (src && !src.includes('logo') && !src.includes('banner') && !src.includes('icon')) {
                const fullUrl = src.startsWith('//') ? `https:${src}` : src;
                if (!pages.includes(fullUrl)) {
                    pages.push(fullUrl);
                }
            }
        });

        if (pages.length === 0) {
            throw new Error('No pages found');
        }

        return pages;
    }

    parseTags($: CheerioAPI): TagSection[] {
        const tags: Tag[] = [];
        $('a[href*="/the-loai/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const text = $(el).text().trim();
            const m = href.match(/\/the-loai\/([a-zA-Z0-9_-]+)\.html/);
            if (m && text && !tags.some(t => t.id === m[1])) {
                tags.push(App.createTag({ id: m[1], label: text }));
            }
        });
        return [App.createTagSection({ id: 'genres', label: 'Thể Loại', tags })];
    }

    isLastPage($: CheerioAPI, currentPage: number = 1): boolean {
        const pageRedirect = $('div.page_redirect');
        if (pageRedirect.length === 0) return true;

        const hasNext = $('div.page_redirect a').filter((_, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href') || '';
            return text === '›' || text === '»' || href.includes(`/trang-${currentPage + 1}.html`);
        }).length > 0;

        return !hasNext;
    }
}

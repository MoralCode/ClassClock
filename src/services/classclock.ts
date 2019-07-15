// import _ from 'lodash';

const CLASSCLOCK_ENDPOINT = 'https://www.reddit.com';

class ClassClockService {

    async getDefaultSubreddits() {
        const url = `${CLASSCLOCK_ENDPOINT}/subreddits/default.json`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`RedditService getDefaultSubreddits failed, HTTP status ${response.status}`);
        }
        const data = await response.json();
        const children = _.get(data, 'data.children');
        if (!children) {
            throw new Error(`RedditService getDefaultSubreddits failed, children not returned`);
        }
        return _.map(children, (subreddit) => {
            // abstract away the specifics of the reddit API response and take only the fields we care about
            return {
                title: _.get(subreddit, 'data.display_name'),
                description: _.get(subreddit, 'data.public_description'),
                url: _.get(subreddit, 'data.url')
            }
        });
    }

}

export default new ClassClockService();
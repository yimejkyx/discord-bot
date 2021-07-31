const {logger} = require('./helpers/logger');
const {timeoutDelMessages} = require("./helpers/timeoutDelMessages");
const {cmdPrefix} = require("../config.json");

function getDefaultState() {
    return {
        neededVotes: null,
        lock: false,
        user: null,
        votes: null,
        timeout: null,
        channel: null,
        guild: null,
        initMsg: null
    };
}

class VoteKickManager {
    static state = getDefaultState();
    static guildMember = null;

    static lock() {
        if (this.state.lock) return false;
        this.state.lock = true;
        logger.debug(`VoteKickMnager Lock`);
        return true;
    }

    static unlock() {
        logger.debug(`VoteKickMnager Unlock`);
        this.state.lock = false;
    }

    static clearState() {
        clearTimeout(this.state.timeout);
        this.state = {
            ...getDefaultState(),
            lock: this.state.lock
        };
        this.guildMember = null;
    }

    static hasActiveVoting() {
        return !!this.state.user;
    }

    static async timeoutVotekick() {
        logger.log('debug', `VoteKickManager: timeoutVotekick start`);
        if (!this.lock()) return this.setupTimeout(5 * 1000);

        const reply = await this.state.channel?.send(`Nepodarilo še kicknut ${this.guildMember} :((`);
        const { initMsg } = this.state;
        const delPromise = timeoutDelMessages(5000, [reply, initMsg]);

        this.clearState();
        this.unlock();

        await delPromise;
        logger.log('debug', `VoteKickManager: timeoutVotekick end`);
    }

    static setupTimeout(time=60 * 1000) {
        this.state.timeout = setTimeout(this.timeoutVotekick.bind(this), time); 
    }

    static async initState(msg, user) {
        logger.log('debug', `VoteKickManager: initState start`);
        this.state.user = user;
        this.state.votes = [];
        this.state.channel = msg.channel;
        this.state.guild = msg.guild;

        this.guildMember = this.state.guild.members.cache.find(member => member.id === user.id);
  
        const voiceState = this.state.guild.voiceStates.cache.find(voiceState => voiceState.id === msg.member.id);
        const voiceRoomCount =  voiceState.channel.members.reduce((sum) => sum + 1, 0);
        this.state.neededVotes = Math.ceil(voiceRoomCount * 0.5);

        const countText = `**${this.state.votes.length}/${this.state.neededVotes}**`;
        this.state.initMsg = await msg.channel.send(`*YimyKick 3000* kickujeme ${this.guildMember}!! Treba bratanov ${countText}, napis **${cmdPrefix}vk**`);

        this.setupTimeout();
        logger.log('debug', `VoteKickManager: initState end, needVotes ${this.state.neededVotes}`);
    }

    static async voteUser(votingUserId, msg) {
        logger.log('debug', `VoteKickManager: voteUser start`);

        if (this.state.votes.includes(votingUserId)) {
            return await msg.reply(`Už si votoval ty piča!!`);
        };

        // increase votes
        this.state.votes.push(votingUserId);
        if (this.state.votes.length >= this.state.neededVotes) {
            logger.debug(`VoteKickManager: voteUser kicking user`);
            await this.kickUser();
        } else {
            logger.debug(`VoteKickManager: voteUser increase vote`);
            const countText = `**${this.state.votes.length}/${this.state.neededVotes}**`;
            await this.state.initMsg.edit(`*YimyKick 3000* kickujeme ${this.guildMember}!! Treba bratanov ${countText}, napis **${cmdPrefix}vk**`);
        }

        logger.log('debug', `VoteKickManager: voteUser end`);
        return null;
    }

    static async kickUser() {
        let reply = await this.state.channel.send(`AAAAANd its gone....`);
        const {  guild, user, initMsg } = this.state;

        const voiceState = guild.voiceStates.cache
            .find(voiceState => voiceState.id === user.id)

        await Promise.all([
            voiceState.kick(),
            timeoutDelMessages(0, [initMsg]),
            timeoutDelMessages(5000, [reply])
        ]);

        this.clearState();
    }
}

module.exports = {
    VoteKickManager
};

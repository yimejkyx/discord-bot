const {logger} = require('../helpers/logger');
const {timeoutDelMessages} = require("../helpers/timeoutDelMessages");

function getDefaultState() {
    return {
        neededVotes: null,
        lock: false,
        user: null,
        votes: null,
        timeout: null,
        channel: null,
        guild: null
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

        const reply = await this.state.channel?.send(`Nepodarilo še kicknut "${this.guildMember.displayName}" :((`);
        await timeoutDelMessages(5000, [reply]);

        this.clearState();
        this.unlock();
        logger.log('debug', `VoteKickManager: timeoutVotekick end`);
    }

    static setupTimeout(time=60 * 1000) {
        this.state.timeout = setTimeout(this.timeoutVotekick.bind(this), time); 
    }

    static initState(msg, user) {
        logger.log('debug', `VoteKickManager: initState start`);
        this.state.user = user;
        this.state.votes = [];
        this.state.channel = msg.channel;
        this.state.guild = msg.guild;

        this.guildMember = this.state.guild.members.cache.find(member => member.id === user.id);
  
        const voiceState = this.state.guild.voiceStates.cache.find(voiceState => voiceState.id === msg.member.id);
        const voiceRoomCount =  voiceState.channel.members.reduce((sum) => sum + 1, 0);
        this.state.neededVotes = Math.ceil(voiceRoomCount * 0.5);

        this.setupTimeout();
        logger.log('debug', `VoteKickManager: initState end, needVotes ${this.state.neededVotes}`);
    }

    static async voteUser(votingUserId, msg) {
        logger.log('debug', `VoteKickManager: voteUser start`);
        let reply;

        if (this.state.votes.includes(votingUserId)) {
            reply = await msg.reply(`Už si votoval ty piča!! ${this.state.votes.length}/${this.state.neededVotes}`);
            return reply;
        };

        // increase votes
        this.state.votes.push(votingUserId);
        if (this.state.votes.length >= this.state.neededVotes) {
            logger.debug(`VoteKickManager: voteUser kicking user`);

            await this.kickUser();

            reply = await msg.reply(`AAAAANd its gone....`);
            this.clearState();
        } else {
            logger.debug(`VoteKickManager: voteUser increase vote`);
            reply = await msg.reply(`YimyKick 3000: kickujeme "${this.guildMember.displayName}" ${this.state.votes.length}/${this.state.neededVotes}`);
        }
        logger.log('debug', `VoteKickManager: voteUser end`);

        return reply;
    }

    static async kickUser() {
        const voiceState = this.state.guild.voiceStates.cache
            .find(voiceState => voiceState.id === this.state.user.id)
        await voiceState.kick();
    }
}

module.exports = {
    VoteKickManager
};

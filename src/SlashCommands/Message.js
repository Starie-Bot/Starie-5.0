/**
  * A base identifier for any type of Discord Interaction
  */

const { InteractionResponseType } = require('discord-interactions')

/**
     * @typedef  {Object}   InteractionCommandData
     * @property {boolean}  tts
     * @property {String}   content
     * @property {number}   flags
     */
class Message {
  constructor (client, msg, res) {
    /**
      * The client of which spawned this instance.
      * @type {import("discord.js").Client}
      */
    this.client = client

    /**
      * The pending socket for responses.
      * @type {import("express").Response}
      */
    this.webResponse = res

    /**
      * The interaction ID.
      * @type {import("discord.js").Snowflake}
      * @readonly
      */
    this.id = msg.id

    /**
      * The percieved type of interaction.
      * @type {import("discord-interactions").InteractionType}
      */
    this.type = msg.type

    /**
      * The ID of the guild in which it was invoked.
      * @type {import("discord.js").Snowflake}
      * @private
      */
    this._guild_id = msg.guild_id

    /**
      * The ID of the channel in which it was invoked.
      * @type {import("discord.js").Snowflake}
      * @private
      */
    this._channel_id = msg.channel_id

    /**
     * The ID of the member in which invoked.
     * @type {import("discord.js").Snowflake}
     * @private
     */
    this._member_id = msg.member.id

    /**
     * The name of the invoked command.
     * @type {string}
     */
    this._command_name = msg.data.name

    /**
      * The arguments received within the command.
      * @type {import("../CommandSystem/Command").Option[]}
      */
    this._arguments = msg.data.choices
  }

  /**
   * @returns {import('discord.js').Guild}
   */
  async getGuild () {
    return await this.client.guilds.fetch(this._guild_id)
  }

  /**
   * @returns {import('discord.js').GuildMember}
   */
  async getMember () {
    return await (await this.getGuild()).members.fetch(this._member_id)
  }

  /**
   * @returns {import('discord.js').Channel}
   */
  async getChannel () {
    return await (await this.getGuild()).channels.fetch(this._channel_id)
  }

  /**
    * Reply to a command message with another message.
    * @param {InteractionCommandData} data
    */
  Reply (data) {
    this.webResponse.send({
      type: InteractionResponseType.CHANNEL_MESSAGE,
      data
    })
  }

  /**
    * Reply to the command message without a message.
    */
  Acknowledge () {
    this.webResponse.send({
      type: InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE
    })
  }
}

module.exports = Message

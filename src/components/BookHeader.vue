<script>
export default {
        props: ['text'],
        data: function() {
            return {
                headerId: "header-" + this.text.index,
            }
        },
        render: function(createElement) {
            return createElement(
                'h' + this.text.hLevel,
                {
                    class: {
                        header: true,
                    },
                    style: {
                        margin: this.text.jisage + "em 0 0 0",
                    },
                    key: this.text.index,
                },
                this.text.content,
            )
        },
}
</script>
    });
    <style>
    </style>
<script>
import Vue from 'vue'
export default Vue.extend({
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
                        'header': true,
                        'text-component': true,
                    },
                    style: {
                        margin: this.text.jisage + "em 0 0 0",
                    },
                    key: this.text.index,
                },
                this.text.content,
            )
        },
});
</script>
    });
    <style>
    </style>